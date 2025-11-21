import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccountRepository } from '../../../domain/account/repositories/account.repository.interface';
import { AccountSwitcherService } from '../../../domain/account/services/account-switcher.service';

/**
 * Switch Account Command
 * Switches the current active account
 */
@Injectable({
  providedIn: 'root'
})
export class SwitchAccountCommand {
  private readonly accountSwitcher = inject(AccountSwitcherService);

  /**
   * Execute the switch account command
   */
  execute(accountId: string): boolean {
    return this.accountSwitcher.switchToAccount(accountId);
  }
}
