import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { IAccountRepository } from '../../../domain/account/repositories/account.repository.interface';
import { Account } from '../../../domain/account/models/account.model';
import { UserAccount } from '../../../domain/account/models/user-account.model';
import { OrganizationAccount } from '../../../domain/account/models/organization-account.model';
import { BotAccount } from '../../../domain/account/models/bot-account.model';
import { AccountMapper } from '../mappers/account.mapper';
import { SupabaseService } from '../../../services/supabase.service';
import { AccountType } from '../../../domain/account/value-objects/account-type.vo';

/**
 * Supabase Account Repository Implementation
 * Concrete implementation of IAccountRepository using Supabase
 */
@Injectable({
  providedIn: 'root'
})
export class AccountRepository implements IAccountRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  findById(id: string): Observable<Account | null> {
    const client = this.supabaseService.client;
    if (!client) {
      return of(null);
    }

    return from(
      client
        .from('accounts')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) return null;
        return AccountMapper.toDomain(data);
      }),
      catchError(() => of(null))
    );
  }

  findByUsername(username: string): Observable<Account | null> {
    const client = this.supabaseService.client;
    if (!client) {
      return of(null);
    }

    return from(
      client
        .from('accounts')
        .select('*')
        .eq('username', username)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) return null;
        return AccountMapper.toDomain(data);
      }),
      catchError(() => of(null))
    );
  }

  findAccessibleAccounts(userId: string): Observable<Account[]> {
    const client = this.supabaseService.client;
    if (!client) {
      return of([]);
    }

    // Find user's own account, organizations they're member of, and bots they own
    return from(
      Promise.all([
        // User's own account
        client
          .from('accounts')
          .select('*')
          .eq('id', userId)
          .single(),
        // Organizations the user is a member of
        client
          .from('organization_members')
          .select('organization_id')
          .eq('account_id', userId),
        // Bots owned by the user
        client
          .from('accounts')
          .select('*')
          .eq('owner_id', userId)
          .eq('type', AccountType.BOT)
      ])
    ).pipe(
      switchMap(([userResult, orgMemberships, botResults]) => {
        const accounts: Account[] = [];

        // Add user account
        if (userResult.data) {
          accounts.push(AccountMapper.toDomain(userResult.data));
        }

        // Add bots
        if (botResults.data) {
          accounts.push(...botResults.data.map(AccountMapper.toDomain));
        }

        // If user is member of organizations, fetch them
        if (!orgMemberships.data || orgMemberships.data.length === 0) {
          return of(accounts);
        }

        const orgIds = orgMemberships.data.map(m => m.organization_id);
        return from(
          client
            .from('accounts')
            .select('*')
            .in('id', orgIds)
        ).pipe(
          map(({ data }) => {
            if (data) {
              accounts.push(...data.map(AccountMapper.toDomain));
            }
            return accounts;
          })
        );
      }),
      catchError(() => of([]))
    );
  }

  createUser(account: UserAccount): Observable<UserAccount> {
    const client = this.supabaseService.client;
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(
      client
        .from('accounts')
        .insert(AccountMapper.toInsert(account))
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          throw new Error(error?.message || 'Failed to create user account');
        }
        return AccountMapper.toDomain(data) as UserAccount;
      })
    );
  }

  createOrganization(account: OrganizationAccount): Observable<OrganizationAccount> {
    const client = this.supabaseService.client;
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(
      client
        .from('accounts')
        .insert(AccountMapper.toInsert(account))
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          throw new Error(error?.message || 'Failed to create organization account');
        }
        return AccountMapper.toDomain(data) as OrganizationAccount;
      })
    );
  }

  createBot(account: BotAccount): Observable<BotAccount> {
    const client = this.supabaseService.client;
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(
      client
        .from('accounts')
        .insert(AccountMapper.toInsert(account))
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          throw new Error(error?.message || 'Failed to create bot account');
        }
        return AccountMapper.toDomain(data) as BotAccount;
      })
    );
  }

  update(account: Account): Observable<Account> {
    const client = this.supabaseService.client;
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(
      client
        .from('accounts')
        .update(AccountMapper.toUpdate(account))
        .eq('id', account.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          throw new Error(error?.message || 'Failed to update account');
        }
        return AccountMapper.toDomain(data);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    const client = this.supabaseService.client;
    if (!client) {
      return of(false);
    }

    return from(
      client
        .from('accounts')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => !error),
      catchError(() => of(false))
    );
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    const client = this.supabaseService.client;
    if (!client) {
      return of(false);
    }

    return from(
      client
        .from('accounts')
        .select('id')
        .eq('username', username)
        .maybeSingle()
    ).pipe(
      map(({ data }) => data === null),
      catchError(() => of(false))
    );
  }
}
