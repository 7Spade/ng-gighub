import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { UserAccount } from '../models/user-account.model';
import { OrganizationAccount } from '../models/organization-account.model';
import { BotAccount } from '../models/bot-account.model';

/**
 * Account Repository Interface
 * Defines the contract for account persistence operations
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
   * Find all accounts accessible by a user (user itself + organizations + bots)
   */
  findAccessibleAccounts(userId: string): Observable<Account[]>;

  /**
   * Create a new user account
   */
  createUser(account: UserAccount): Observable<UserAccount>;

  /**
   * Create a new organization account
   */
  createOrganization(account: OrganizationAccount): Observable<OrganizationAccount>;

  /**
   * Create a new bot account
   */
  createBot(account: BotAccount): Observable<BotAccount>;

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
