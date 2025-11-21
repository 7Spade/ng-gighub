import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IAccountRepository } from '../../../domain/account/repositories/account.repository.interface';
import { Account } from '../../../domain/account/models/account.model';
import { AccountType } from '../../../domain/account/value-objects/account-type.vo';
import { SupabaseService } from '../../../services/supabase.service';
import { AccountMapper, AccountRow } from '../mappers/account.mapper';

/**
 * Supabase implementation of Account Repository
 * Handles all database operations for accounts
 */
@Injectable({
  providedIn: 'root'
})
export class AccountRepository implements IAccountRepository {
  private readonly supabase = inject(SupabaseService);
  private readonly tableName = 'accounts';

  /**
   * Find account by ID
   */
  findById(id: string): Observable<Account | null> {
    const client = this.supabase.client;
    if (!client) {
      return of(null);
    }

    return from(
      client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) return null;
        return AccountMapper.toDomain(data as AccountRow);
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Find account by username
   */
  findByUsername(username: string): Observable<Account | null> {
    const client = this.supabase.client;
    if (!client) {
      return of(null);
    }

    return from(
      client
        .from(this.tableName)
        .select('*')
        .eq('username', username)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) return null;
        return AccountMapper.toDomain(data as AccountRow);
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Find accounts by type
   */
  findByType(type: AccountType): Observable<Account[]> {
    const client = this.supabase.client;
    if (!client) {
      return of([]);
    }

    return from(
      client
        .from(this.tableName)
        .select('*')
        .eq('type', type)
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) return [];
        return AccountMapper.toDomainArray(data as AccountRow[]);
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Get all accessible accounts for a user
   * This includes the user's own account and organizations they belong to
   */
  findAccessibleAccounts(userId: string): Observable<Account[]> {
    const client = this.supabase.client;
    if (!client) {
      return of([]);
    }

    // Note: This is a simplified implementation
    // In a real app, you'd need a proper query that joins with organization_members table
    return from(
      client
        .from(this.tableName)
        .select('*')
        .or(`id.eq.${userId},type.eq.organization`)
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) return [];
        return AccountMapper.toDomainArray(data as AccountRow[]);
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Create a new account
   */
  create(account: Account): Observable<Account> {
    const client = this.supabase.client;
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const row = AccountMapper.toPersistence(account);
    delete row.id; // Let database generate ID

    return from(
      client
        .from(this.tableName)
        .insert(row)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return AccountMapper.toDomain(data as AccountRow);
      })
    );
  }

  /**
   * Update an existing account
   */
  update(account: Account): Observable<Account> {
    const client = this.supabase.client;
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const row = AccountMapper.toPersistence(account);
    
    return from(
      client
        .from(this.tableName)
        .update(row)
        .eq('id', account.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return AccountMapper.toDomain(data as AccountRow);
      })
    );
  }

  /**
   * Delete an account
   */
  delete(id: string): Observable<boolean> {
    const client = this.supabase.client;
    if (!client) {
      return of(false);
    }

    return from(
      client
        .from(this.tableName)
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => !error),
      catchError(() => of(false))
    );
  }

  /**
   * Check if username is available
   */
  isUsernameAvailable(username: string): Observable<boolean> {
    const client = this.supabase.client;
    if (!client) {
      return of(false);
    }

    return from(
      client
        .from(this.tableName)
        .select('username')
        .eq('username', username)
        .maybeSingle()
    ).pipe(
      map(({ data }) => data === null),
      catchError(() => of(false))
    );
  }
}
