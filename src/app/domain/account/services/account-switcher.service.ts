import { Injectable, signal, computed } from '@angular/core';
import { Account } from '../models/account.model';

/**
 * Service for managing account switching functionality
 * Tracks current account and provides methods to switch between accessible accounts
 */
@Injectable({
  providedIn: 'root'
})
export class AccountSwitcherService {
  // Current selected account
  private readonly currentAccountSignal = signal<Account | null>(null);

  // List of accounts user can switch to
  private readonly accessibleAccountsSignal = signal<Account[]>([]);

  // Public readonly signals
  readonly currentAccount = this.currentAccountSignal.asReadonly();
  readonly accessibleAccounts = this.accessibleAccountsSignal.asReadonly();

  // Computed: check if user has multiple accounts to switch between
  readonly canSwitch = computed(() => this.accessibleAccountsSignal().length > 1);

  /**
   * Set the current account
   */
  setCurrentAccount(account: Account | null): void {
    this.currentAccountSignal.set(account);
  }

  /**
   * Set the list of accessible accounts
   */
  setAccessibleAccounts(accounts: Account[]): void {
    this.accessibleAccountsSignal.set(accounts);
  }

  /**
   * Switch to a different account
   */
  switchToAccount(accountId: string): boolean {
    const account = this.accessibleAccountsSignal().find(acc => acc.id === accountId);
    
    if (account) {
      this.currentAccountSignal.set(account);
      return true;
    }
    
    return false;
  }

  /**
   * Get current account ID
   */
  getCurrentAccountId(): string | null {
    return this.currentAccountSignal()?.id ?? null;
  }

  /**
   * Check if a specific account is currently selected
   */
  isCurrentAccount(accountId: string): boolean {
    return this.currentAccountSignal()?.id === accountId;
  }

  /**
   * Clear current account (logout scenario)
   */
  clear(): void {
    this.currentAccountSignal.set(null);
    this.accessibleAccountsSignal.set([]);
  }
}
