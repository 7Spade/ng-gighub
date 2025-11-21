import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountRepository } from '../../../infrastructure/supabase/repositories/account.repository';
import { AccountDto, accountToDto } from '../dto/account.dto';

/**
 * Get Current Account Query
 * Retrieves the currently active account
 */
export interface GetCurrentAccountQuery {
  accountId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetCurrentAccountQueryHandler {
  constructor(private readonly accountRepository: AccountRepository) {}

  execute(query: GetCurrentAccountQuery): Observable<AccountDto | null> {
    return this.accountRepository.findById(query.accountId).pipe(
      map(account => account ? accountToDto(account) : null)
    );
  }
}
