import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  throwError,
  timer,
} from 'rxjs';
import {
  catchError,
  delay,
  finalize,
  retryWhen,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

/**
 * Circuit breaker states
 */
export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Configuration constants
 */
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;
const CIRCUIT_FAILURE_THRESHOLD = 5;
const CIRCUIT_COOLDOWN_MS = 30000;

/**
 * Service providing robust external API call infrastructure with:
 * - Request deduplication
 * - Retry logic with exponential backoff (GET only)
 * - Simple circuit breaker pattern
 */
@Injectable({
  providedIn: 'root',
})
export class CopilotAgentService {
  private readonly http = inject(HttpClient);

  /**
   * Cache for in-flight requests to implement deduplication
   */
  private readonly inFlightRequests = new Map<string, Observable<unknown>>();

  /**
   * Circuit breaker state
   */
  private readonly circuitState$ = new BehaviorSubject<CircuitState>(
    CircuitState.CLOSED
  );

  /**
   * Consecutive failure counter
   */
  private consecutiveFailures = 0;

  /**
   * Timer ID for circuit cooldown
   */
  private circuitCooldownTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Get current circuit state as Observable
   */
  public get circuitState(): Observable<CircuitState> {
    return this.circuitState$.asObservable();
  }

  /**
   * Fetch data from API with retry, deduplication, and circuit breaker
   *
   * @param path - API path
   * @param params - Optional query parameters
   * @returns Observable of type T
   */
  public fetch<T>(
    path: string,
    params?: Record<string, string>
  ): Observable<T> {
    // Build request key for deduplication
    const requestKey = this.buildRequestKey(path, params);

    // Check circuit breaker state
    if (this.circuitState$.value === CircuitState.OPEN) {
      return throwError(
        () =>
          new Error(
            'Circuit breaker is OPEN - request rejected without attempting'
          )
      );
    }

    // Check if request is already in-flight
    const inFlight = this.inFlightRequests.get(requestKey);
    if (inFlight) {
      return inFlight as Observable<T>;
    }

    // Build URL with query parameters
    const url = this.buildUrl(path, params);

    // Create new request observable
    const request$ = this.http.get<T>(url).pipe(
      // Retry logic (only for GET requests)
      retryWhen((errors) =>
        errors.pipe(
          switchMap((error, retryCount) => {
            // Check if we should retry
            if (!this.shouldRetry(error, retryCount)) {
              return throwError(() => error);
            }

            // Calculate delay with exponential backoff and jitter
            const backoffDelay = this.calculateBackoffDelay(retryCount);

            console.warn(
              `[CopilotAgentService] Retrying request (${retryCount + 1}/${MAX_RETRIES}):`,
              {
                url,
                error:
                  error instanceof HttpErrorResponse
                    ? error.status
                    : 'Network error',
                delay: backoffDelay,
              }
            );

            return timer(backoffDelay);
          })
        )
      ),
      // Handle success - reset circuit breaker
      tap(() => {
        this.onSuccess();
      }),
      // Handle errors - update circuit breaker
      catchError((error: unknown) => {
        this.onFailure();
        return throwError(() => error);
      }),
      // Cleanup - remove from in-flight cache
      finalize(() => {
        this.inFlightRequests.delete(requestKey);
      }),
      // Share replay for deduplication
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // Store in-flight request
    this.inFlightRequests.set(requestKey, request$);

    return request$;
  }

  /**
   * Build request key for deduplication
   */
  private buildRequestKey(
    path: string,
    params?: Record<string, string>
  ): string {
    const paramString = params
      ? Object.entries(params)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : '';

    return paramString ? `${path}?${paramString}` : path;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    const queryString = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    return `${path}?${queryString}`;
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: unknown, retryCount: number): boolean {
    // Check retry limit
    if (retryCount >= MAX_RETRIES) {
      return false;
    }

    // Only retry on 5xx errors or network errors
    if (error instanceof HttpErrorResponse) {
      return error.status >= 500 && error.status < 600;
    }

    // Retry on network errors (non-HTTP errors)
    return true;
  }

  /**
   * Calculate backoff delay with exponential backoff and jitter
   */
  private calculateBackoffDelay(retryCount: number): number {
    // Exponential backoff: base * 2^retryCount
    const exponentialDelay = RETRY_BASE_DELAY_MS * Math.pow(2, retryCount);

    // Add jitter: random value between 0 and 50% of delay
    const jitter = Math.random() * (exponentialDelay * 0.5);

    return exponentialDelay + jitter;
  }

  /**
   * Handle successful request - reset circuit breaker
   */
  private onSuccess(): void {
    this.consecutiveFailures = 0;

    // If circuit was HALF_OPEN, transition to CLOSED
    if (this.circuitState$.value === CircuitState.HALF_OPEN) {
      console.info(
        '[CopilotAgentService] Circuit breaker transitioning: HALF_OPEN → CLOSED'
      );
      this.circuitState$.next(CircuitState.CLOSED);
    }
  }

  /**
   * Handle failed request - update circuit breaker
   */
  private onFailure(): void {
    this.consecutiveFailures++;

    console.warn(
      `[CopilotAgentService] Request failed (${this.consecutiveFailures}/${CIRCUIT_FAILURE_THRESHOLD})`
    );

    // Check if threshold reached
    if (
      this.consecutiveFailures >= CIRCUIT_FAILURE_THRESHOLD &&
      this.circuitState$.value === CircuitState.CLOSED
    ) {
      this.openCircuit();
    }
  }

  /**
   * Open circuit breaker and start cooldown timer
   */
  private openCircuit(): void {
    console.error(
      `[CopilotAgentService] Circuit breaker OPENING after ${CIRCUIT_FAILURE_THRESHOLD} consecutive failures`
    );

    this.circuitState$.next(CircuitState.OPEN);

    // Clear existing timer if any
    if (this.circuitCooldownTimer) {
      clearTimeout(this.circuitCooldownTimer);
    }

    // Start cooldown timer
    this.circuitCooldownTimer = setTimeout(() => {
      this.halfOpenCircuit();
    }, CIRCUIT_COOLDOWN_MS);
  }

  /**
   * Transition circuit to HALF_OPEN state after cooldown
   */
  private halfOpenCircuit(): void {
    console.info(
      '[CopilotAgentService] Circuit breaker transitioning: OPEN → HALF_OPEN'
    );

    this.circuitState$.next(CircuitState.HALF_OPEN);
    this.consecutiveFailures = 0;
    this.circuitCooldownTimer = null;
  }
}
