import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
    return toObservable(this.accountSwitcher.currentAccount);
  }
}
