import { Injectable, signal, computed } from '@angular/core';
import { AccountDto } from '../../../application/account/dto/account.dto';

/**
 * Accessible Accounts Store
 * Manages the state of accounts that can be switched to
 */
@Injectable({
  providedIn: 'root'
})
export class AccessibleAccountsStore {
  // State
  private readonly _accounts = signal<AccountDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Selectors
  readonly accounts = this._accounts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly accountCount = computed(() => this.accounts().length);
  readonly userAccounts = computed(() => 
    this.accounts().filter(acc => acc.type === 'user')
  );
  readonly organizationAccounts = computed(() => 
    this.accounts().filter(acc => acc.type === 'organization')
  );
  readonly botAccounts = computed(() => 
    this.accounts().filter(acc => acc.type === 'bot')
  );

  // Actions
  setAccounts(accounts: AccountDto[]): void {
    this._accounts.set(accounts);
    this._error.set(null);
  }

  addAccount(account: AccountDto): void {
    const current = this._accounts();
    if (!current.some(acc => acc.id === account.id)) {
      this._accounts.set([...current, account]);
    }
  }

  removeAccount(accountId: string): void {
    this._accounts.set(this._accounts().filter(acc => acc.id !== accountId));
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
    this._loading.set(false);
  }

  clear(): void {
    this._accounts.set([]);
    this._loading.set(false);
    this._error.set(null);
  }
}
