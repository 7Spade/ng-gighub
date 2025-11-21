import { Injectable, signal, computed, effect } from '@angular/core';
import { AccountDto } from '../../../application/account/dto/account.dto';

/**
 * Current Account Store
 * Manages the state of the currently active account
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentAccountStore {
  // State
  private readonly _account = signal<AccountDto | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Selectors
  readonly account = this._account.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isUser = computed(() => this.account()?.type === 'user');
  readonly isOrganization = computed(() => this.account()?.type === 'organization');
  readonly isBot = computed(() => this.account()?.type === 'bot');
  readonly username = computed(() => this.account()?.username ?? null);
  readonly displayName = computed(() => this.account()?.displayName ?? null);

  // Actions
  setAccount(account: AccountDto | null): void {
    this._account.set(account);
    this._error.set(null);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
    this._loading.set(false);
  }

  clear(): void {
    this._account.set(null);
    this._loading.set(false);
    this._error.set(null);
  }
}
