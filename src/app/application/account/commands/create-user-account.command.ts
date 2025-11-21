import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAccount } from '../../../domain/account/models/user-account.model';
import { AccountRepository } from '../../../infrastructure/supabase/repositories/account.repository';
import { map } from 'rxjs/operators';
import { AccountDto, accountToDto } from '../dto/account.dto';

// Constant for new entity placeholder ID
const NEW_ENTITY_ID = '00000000-0000-0000-0000-000000000000';

/**
 * Create User Account Command
 */
export interface CreateUserAccountCommand {
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateUserAccountCommandHandler {
  constructor(private readonly accountRepository: AccountRepository) {}

  execute(command: CreateUserAccountCommand): Observable<AccountDto> {
    // Use placeholder ID that will be replaced by database
    const userAccount = new UserAccount(
      NEW_ENTITY_ID,
      command.username,
      command.displayName,
      command.email,
      command.avatarUrl || null,
      command.bio || null
    );

    if (!userAccount.validate()) {
      throw new Error('Invalid user account data');
    }

    return this.accountRepository.createUser(userAccount).pipe(
      map(accountToDto)
    );
  }
}
