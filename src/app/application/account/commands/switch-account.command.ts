import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountSwitcherService } from '../../../domain/account/services/account-switcher.service';
import { AccountRepository } from '../../../infrastructure/supabase/repositories/account.repository';
import { tap } from 'rxjs/operators';
import { Account } from '../../../domain/account/models/account.model';

/**
 * Switch Account Command
 * Switches the current active account context
 */
export interface SwitchAccountCommand {
  accountId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SwitchAccountCommandHandler {
  constructor(
    private readonly accountSwitcher: AccountSwitcherService,
    private readonly accountRepository: AccountRepository
  ) {}

  execute(command: SwitchAccountCommand): Observable<Account | null> {
    return this.accountRepository.findById(command.accountId).pipe(
      tap(account => {
        if (account) {
          this.accountSwitcher.switchAccount(account);
        } else {
          throw new Error('Account not found');
        }
      })
    );
  }
}
