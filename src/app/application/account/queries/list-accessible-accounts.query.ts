import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountRepository } from '../../../infrastructure/supabase/repositories/account.repository';
import { AccountDto, accountToDto } from '../dto/account.dto';

/**
 * List Accessible Accounts Query
 * Lists all accounts the user can switch to
 */
export interface ListAccessibleAccountsQuery {
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListAccessibleAccountsQueryHandler {
  constructor(private readonly accountRepository: AccountRepository) {}

  execute(query: ListAccessibleAccountsQuery): Observable<AccountDto[]> {
    return this.accountRepository.findAccessibleAccounts(query.userId).pipe(
      map(accounts => accounts.map(accountToDto))
    );
  }
}
