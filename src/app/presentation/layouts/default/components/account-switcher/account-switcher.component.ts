import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentAccountStore } from '../../../../store/account/current-account.store';
import { AccessibleAccountsStore } from '../../../../store/account/accessible-accounts.store';

/**
 * Account Switcher Component
 * Allows users to switch between their accessible accounts
 */
@Component({
  selector: 'app-account-switcher',
  imports: [CommonModule],
  templateUrl: './account-switcher.component.html',
  styleUrl: './account-switcher.component.scss'
})
export class AccountSwitcherComponent implements OnInit {
  protected readonly currentAccountStore = inject(CurrentAccountStore);
  protected readonly accessibleAccountsStore = inject(AccessibleAccountsStore);

  // Expose computed signals for template
  protected readonly currentAccount = this.currentAccountStore.currentAccount;
  protected readonly accessibleAccounts = this.accessibleAccountsStore.accessibleAccounts;
  protected readonly canSwitch = this.accessibleAccountsStore.canSwitch;
  protected readonly loading = this.accessibleAccountsStore.loading;

  ngOnInit(): void {
    // Load current account on initialization
    this.currentAccountStore.loadCurrentAccount();
    
    // Load accessible accounts if we have a current account
    const currentAccountId = this.currentAccountStore.accountId();
    if (currentAccountId) {
      this.accessibleAccountsStore.loadAccessibleAccounts(currentAccountId);
    }
  }

  /**
   * Handle account switch
   */
  protected onSwitchAccount(accountId: string): void {
    const success = this.currentAccountStore.switchAccount(accountId);
    
    if (success) {
      // Optionally reload data or navigate
      console.log('Switched to account:', accountId);
    }
  }

  /**
   * Get avatar URL or fallback
   */
  protected getAvatarUrl(avatarUrl: string | null): string {
    return avatarUrl || 'assets/default-avatar.png';
  }
}
