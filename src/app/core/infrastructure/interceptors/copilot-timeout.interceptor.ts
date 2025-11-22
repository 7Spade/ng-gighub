import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';

/**
 * Default timeout duration for HTTP requests in milliseconds
 */
const DEFAULT_TIMEOUT_MS = 10000;

/**
 * HTTP interceptor that applies a default timeout to all requests
 * and converts timeout errors to HttpErrorResponse with status 504.
 *
 * @param req - The outgoing HTTP request
 * @param next - The next handler in the interceptor chain
 * @returns Observable of the HTTP event
 */
export const copilotTimeoutInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    timeout(DEFAULT_TIMEOUT_MS),
    catchError((error: unknown) => {
      // Handle timeout errors specifically
      if (error instanceof TimeoutError) {
        const timeoutError = new HttpErrorResponse({
          error: 'Request timeout',
          status: 504,
          statusText: 'Gateway Timeout',
          url: req.url,
        });

        // Unified error logging hook
        console.error(
          `[CopilotTimeoutInterceptor] Request timed out after ${DEFAULT_TIMEOUT_MS}ms:`,
          {
            method: req.method,
            url: req.url,
            timeout: DEFAULT_TIMEOUT_MS,
          }
        );

        return throwError(() => timeoutError);
      }

      // For non-timeout errors, log and rethrow
      if (error instanceof HttpErrorResponse) {
        console.error('[CopilotTimeoutInterceptor] HTTP error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
        });
      } else {
        console.error('[CopilotTimeoutInterceptor] Unknown error:', error);
      }

      return throwError(() => error);
    })
  );
};
