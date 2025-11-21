import { Injectable, signal, computed, inject } from '@angular/core';
import { Account } from '../../../domain/account/models/account.model';
import { AccountSwitcherService } from '../../../domain/account/services/account-switcher.service';
import { ListAccessibleAccountsQuery } from '../../../application/account/queries/list-accessible-accounts.query';
import { AccountRepository } from '../../../infrastructure/supabase/repositories/account.repository';

/**
 * Accessible Accounts Store
 * Manages the list of accounts a user can switch to
 */
@Injectable({
  providedIn: 'root'
})
export class AccessibleAccountsStore {
  private readonly accountSwitcher = inject(AccountSwitcherService);
  private readonly listAccessibleAccountsQuery = inject(ListAccessibleAccountsQuery);
  private readonly accountRepository = inject(AccountRepository);

  // Loading state
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  // Error state
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  // Accessible accounts from domain service
  readonly accessibleAccounts = this.accountSwitcher.accessibleAccounts;

  // Computed signals
  readonly accountCount = computed(() => this.accessibleAccounts().length);
  readonly canSwitch = this.accountSwitcher.canSwitch;
  readonly hasMultipleAccounts = computed(() => this.accountCount() > 1);

  /**
   * Load accessible accounts for a user
   */
  loadAccessibleAccounts(userId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.listAccessibleAccountsQuery.execute(userId, this.accountRepository).subscribe({
      next: (accounts) => {
        this.accountSwitcher.setAccessibleAccounts(accounts);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.message || 'Failed to load accessible accounts');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Clear accessible accounts
   */
  clear(): void {
    this.accountSwitcher.setAccessibleAccounts([]);
    this.errorSignal.set(null);
  }
}
