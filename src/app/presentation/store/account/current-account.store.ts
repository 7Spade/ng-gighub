import { Injectable, signal, computed, inject } from '@angular/core';
import { Account } from '../../../domain/account/models/account.model';
import { AccountSwitcherService } from '../../../domain/account/services/account-switcher.service';
import { GetCurrentAccountQuery } from '../../../application/account/queries/get-current-account.query';
import { SwitchAccountCommand } from '../../../application/account/commands/switch-account.command';

/**
 * Current Account Store
 * Manages the state of the currently selected account
 * Uses Angular signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentAccountStore {
  private readonly accountSwitcher = inject(AccountSwitcherService);
  private readonly getCurrentAccountQuery = inject(GetCurrentAccountQuery);
  private readonly switchAccountCommand = inject(SwitchAccountCommand);

  // Signal for current account (from domain service)
  readonly currentAccount = this.accountSwitcher.currentAccount;

  // Computed signals
  readonly hasAccount = computed(() => this.currentAccount() !== null);
  readonly accountId = computed(() => this.currentAccount()?.id ?? null);
  readonly accountUsername = computed(() => this.currentAccount()?.username ?? null);
  readonly accountDisplayName = computed(() => this.currentAccount()?.getDisplayName() ?? null);
  readonly accountType = computed(() => this.currentAccount()?.type ?? null);

  /**
   * Load current account
   */
  loadCurrentAccount(): void {
    const account = this.getCurrentAccountQuery.execute();
    this.accountSwitcher.setCurrentAccount(account);
  }

  /**
   * Switch to a different account
   */
  switchAccount(accountId: string): boolean {
    return this.switchAccountCommand.execute(accountId);
  }

  /**
   * Clear current account
   */
  clearAccount(): void {
    this.accountSwitcher.clear();
  }
}
