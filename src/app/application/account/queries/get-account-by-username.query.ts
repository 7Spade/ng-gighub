import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../../domain/account/models/account.model';
import { IAccountRepository } from '../../../domain/account/repositories/account.repository.interface';

/**
 * Get Account By Username Query
 * Retrieves an account by its username
 */
@Injectable({
  providedIn: 'root'
})
export class GetAccountByUsernameQuery {
  /**
   * Execute query to get account by username
   */
  execute(username: string, repository: IAccountRepository): Observable<Account | null> {
    return repository.findByUsername(username);
  }
}
