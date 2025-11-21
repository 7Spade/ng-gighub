import { Injectable, signal, computed } from '@angular/core';
import { Account } from '../models/account.model';

/**
 * Account Switcher Service
 * Manages the currently active account context
 */
@Injectable({
  providedIn: 'root'
})
export class AccountSwitcherService {
  private readonly _currentAccount = signal<Account | null>(null);
  private readonly _accessibleAccounts = signal<Account[]>([]);

  /**
   * Current active account (read-only signal)
   */
  readonly currentAccount = this._currentAccount.asReadonly();

  /**
   * List of accounts the user can switch to (read-only signal)
   */
  readonly accessibleAccounts = this._accessibleAccounts.asReadonly();

  /**
   * Whether the current account is a user
   */
  readonly isCurrentAccountUser = computed(() => 
    this.currentAccount()?.isUser() ?? false
  );

  /**
   * Whether the current account is an organization
   */
  readonly isCurrentAccountOrganization = computed(() => 
    this.currentAccount()?.isOrganization() ?? false
  );

  /**
   * Whether the current account is a bot
   */
  readonly isCurrentAccountBot = computed(() => 
    this.currentAccount()?.isBot() ?? false
  );

  /**
   * Current account username (for display)
   */
  readonly currentAccountUsername = computed(() => 
    this.currentAccount()?.username ?? null
  );

  /**
   * Switch to a different account
   */
  switchAccount(account: Account): void {
    if (!account) {
      throw new Error('Account cannot be null');
    }

    const accessible = this._accessibleAccounts();
    const isAccessible = accessible.some(acc => acc.id === account.id);

    if (!isAccessible && this._currentAccount()?.id !== account.id) {
      throw new Error('Account is not accessible for switching');
    }

    this._currentAccount.set(account);
  }

  /**
   * Set the list of accessible accounts
   */
  setAccessibleAccounts(accounts: Account[]): void {
    this._accessibleAccounts.set(accounts);
  }

  /**
   * Add an account to the accessible accounts list
   */
  addAccessibleAccount(account: Account): void {
    const current = this._accessibleAccounts();
    if (!current.some(acc => acc.id === account.id)) {
      this._accessibleAccounts.set([...current, account]);
    }
  }

  /**
   * Remove an account from the accessible accounts list
   */
  removeAccessibleAccount(accountId: string): void {
    const current = this._accessibleAccounts();
    this._accessibleAccounts.set(current.filter(acc => acc.id !== accountId));

    // If the removed account was the current one, clear current account
    if (this._currentAccount()?.id === accountId) {
      this._currentAccount.set(null);
    }
  }

  /**
   * Clear current account context
   */
  clearCurrentAccount(): void {
    this._currentAccount.set(null);
  }

  /**
   * Clear all account context
   */
  clearAll(): void {
    this._currentAccount.set(null);
    this._accessibleAccounts.set([]);
  }

  /**
   * Check if an account is accessible
   */
  isAccountAccessible(accountId: string): boolean {
    return this._accessibleAccounts().some(acc => acc.id === accountId);
  }
}
