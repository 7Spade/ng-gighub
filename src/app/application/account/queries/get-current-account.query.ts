import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../../domain/account/models/account.model';
import { AccountSwitcherService } from '../../../domain/account/services/account-switcher.service';

/**
 * Get Current Account Query
 * Retrieves the currently active account
 */
@Injectable({
  providedIn: 'root'
})
export class GetCurrentAccountQuery {
  private readonly accountSwitcher = inject(AccountSwitcherService);

  /**
   * Execute query to get current account
   */
  execute(): Account | null {
    return this.accountSwitcher.currentAccount();
  }

  /**
   * Get current account as observable (via signal)
   */
  asObservable(): Observable<Account | null> {
    // Note: In a real implementation, you might want to convert signal to observable
    // For now, returning a simple implementation
    throw new Error('Not implemented - use execute() for synchronous access');
  }
}
