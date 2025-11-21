import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * Repository interface for Account domain
 * Defines the contract for account data access
 */
export interface IAccountRepository {
  /**
   * Find account by ID
   */
  findById(id: string): Observable<Account | null>;

  /**
   * Find account by username
   */
  findByUsername(username: string): Observable<Account | null>;

  /**
   * Find accounts by type
   */
  findByType(type: AccountType): Observable<Account[]>;

  /**
   * Get all accessible accounts for a user (user's own account + organizations they belong to)
   */
  findAccessibleAccounts(userId: string): Observable<Account[]>;

  /**
   * Create a new account
   */
  create(account: Account): Observable<Account>;

  /**
   * Update an existing account
   */
  update(account: Account): Observable<Account>;

  /**
   * Delete an account
   */
  delete(id: string): Observable<boolean>;

  /**
   * Check if username is available
   */
  isUsernameAvailable(username: string): Observable<boolean>;
}
