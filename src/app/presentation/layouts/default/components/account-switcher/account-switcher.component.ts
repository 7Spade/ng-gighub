import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentAccountStore } from '../../../../store/account/current-account.store';
import { AccessibleAccountsStore } from '../../../../store/account/accessible-accounts.store';
import { SwitchAccountCommandHandler } from '../../../../../application/account/commands/switch-account.command';

/**
 * Account Switcher Component
 * Allows users to switch between accessible accounts
 */
@Component({
  selector: 'app-account-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="account-switcher">
      @if (currentAccount()) {
        <div class="current-account">
          <img [src]="currentAccount()?.avatarUrl || defaultAvatar" [alt]="currentAccount()?.username" />
          <span>{{ currentAccount()?.displayName }}</span>
          <span class="username">@{{ currentAccount()?.username }}</span>
        </div>
      }

      @if (isDropdownOpen()) {
        <div class="dropdown">
          <div class="dropdown-header">Switch Account</div>
          
          @for (account of accessibleAccounts(); track account.id) {
            <button 
              class="account-item"
              [class.active]="account.id === currentAccount()?.id"
              (click)="switchTo(account.id)">
              <img [src]="account.avatarUrl || defaultAvatar" [alt]="account.username" />
              <div class="account-info">
                <span class="name">{{ account.displayName }}</span>
                <span class="username">@{{ account.username }}</span>
                <span class="type">{{ account.type }}</span>
              </div>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .account-switcher {
      position: relative;
    }

    .current-account {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 0.375rem;
      transition: background-color 0.2s;
    }

    .current-account:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .current-account img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .username {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      min-width: 16rem;
      z-index: 50;
    }

    .dropdown-header {
      padding: 0.75rem 1rem;
      font-weight: 600;
      border-bottom: 1px solid #e5e7eb;
    }

    .account-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      cursor: pointer;
      transition: background-color 0.2s;
      text-align: left;
    }

    .account-item:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .account-item.active {
      background-color: rgba(59, 130, 246, 0.1);
    }

    .account-item img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .account-info {
      display: flex;
      flex-direction: column;
    }

    .account-info .name {
      font-weight: 500;
    }

    .account-info .username {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .account-info .type {
      font-size: 0.75rem;
      color: #9ca3af;
      text-transform: uppercase;
    }
  `]
})
export class AccountSwitcherComponent {
  private readonly currentAccountStore = inject(CurrentAccountStore);
  private readonly accessibleAccountsStore = inject(AccessibleAccountsStore);
  private readonly switchAccountHandler = inject(SwitchAccountCommandHandler);

  readonly isDropdownOpen = signal(false);
  readonly defaultAvatar = 'https://via.placeholder.com/32';
  readonly currentAccount = this.currentAccountStore.account;
  readonly accessibleAccounts = this.accessibleAccountsStore.accounts;

  toggleDropdown(): void {
    this.isDropdownOpen.update(val => !val);
  }

  switchTo(accountId: string): void {
    this.switchAccountHandler.execute({ accountId }).subscribe({
      next: (account) => {
        if (account) {
          this.isDropdownOpen.set(false);
        }
      },
      error: (err) => {
        console.error('Failed to switch account:', err);
      }
    });
  }
}
