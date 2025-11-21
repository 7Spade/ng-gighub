import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../../domain/account/models/account.model';
import { IAccountRepository } from '../../../domain/account/repositories/account.repository.interface';

/**
 * List Accessible Accounts Query
 * Gets all accounts that a user can switch to
 */
@Injectable({
  providedIn: 'root'
})
export class ListAccessibleAccountsQuery {
  /**
   * Execute query to get accessible accounts
   */
  execute(userId: string, repository: IAccountRepository): Observable<Account[]> {
    return repository.findAccessibleAccounts(userId);
  }
}
