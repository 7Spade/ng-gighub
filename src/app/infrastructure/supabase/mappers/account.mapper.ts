import { Account } from '../../../domain/account/models/account.model';
import { UserAccount } from '../../../domain/account/models/user-account.model';
import { OrganizationAccount } from '../../../domain/account/models/organization-account.model';
import { BotAccount } from '../../../domain/account/models/bot-account.model';
import { AccountType, isAccountType } from '../../../domain/account/value-objects/account-type.vo';

/**
 * Database row interface for accounts
 */
export interface AccountRow {
  id: string;
  username: string;
  email: string | null;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  type: string;
  created_at: string;
  updated_at: string;
  
  // User-specific fields
  first_name?: string | null;
  last_name?: string | null;
  location?: string | null;
  website?: string | null;
  is_verified?: boolean;
  
  // Organization-specific fields
  company_name?: string | null;
  member_count?: number;
  team_count?: number;
  
  // Bot-specific fields
  owner_id?: string;
  purpose?: string | null;
  is_active?: boolean;
  last_active_at?: string | null;
}

/**
 * Account Mapper
 * Maps between domain models and database rows
 */
export class AccountMapper {
  /**
   * Map database row to domain model (polymorphic)
   */
  static toDomain(row: AccountRow): Account {
    if (!isAccountType(row.type)) {
      throw new Error(`Invalid account type: ${row.type}`);
    }

    const baseProps = {
      id: row.id,
      username: row.username,
      email: row.email,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };

    switch (row.type) {
      case AccountType.USER:
        return new UserAccount(
          baseProps.id,
          baseProps.username,
          baseProps.email,
          baseProps.displayName,
          baseProps.avatarUrl,
          baseProps.bio,
          baseProps.createdAt,
          baseProps.updatedAt,
          row.first_name || null,
          row.last_name || null,
          row.location || null,
          row.website || null,
          row.is_verified || false
        );

      case AccountType.ORGANIZATION:
        return new OrganizationAccount(
          baseProps.id,
          baseProps.username,
          baseProps.email,
          baseProps.displayName,
          baseProps.avatarUrl,
          baseProps.bio,
          baseProps.createdAt,
          baseProps.updatedAt,
          row.company_name || null,
          row.website || null,
          row.location || null,
          row.member_count || 0,
          row.team_count || 0,
          row.is_verified || false
        );

      case AccountType.BOT:
        return new BotAccount(
          baseProps.id,
          baseProps.username,
          baseProps.email,
          baseProps.displayName,
          baseProps.avatarUrl,
          baseProps.bio,
          baseProps.createdAt,
          baseProps.updatedAt,
          row.owner_id || '',
          row.purpose || null,
          row.is_active !== undefined ? row.is_active : true,
          row.last_active_at ? new Date(row.last_active_at) : null
        );

      default:
        throw new Error(`Unsupported account type: ${row.type}`);
    }
  }

  /**
   * Map domain model to database row (polymorphic)
   */
  static toPersistence(account: Account): Partial<AccountRow> {
    const base: Partial<AccountRow> = {
      id: account.id || undefined,
      username: account.username,
      email: account.email,
      display_name: account.displayName,
      avatar_url: account.avatarUrl,
      bio: account.bio,
      type: account.type,
      created_at: account.createdAt.toISOString(),
      updated_at: account.updatedAt.toISOString()
    };

    if (account instanceof UserAccount) {
      return {
        ...base,
        first_name: account.firstName,
        last_name: account.lastName,
        location: account.location,
        website: account.website,
        is_verified: account.isVerified
      };
    }

    if (account instanceof OrganizationAccount) {
      return {
        ...base,
        company_name: account.companyName,
        website: account.website,
        location: account.location,
        member_count: account.memberCount,
        team_count: account.teamCount,
        is_verified: account.isVerified
      };
    }

    if (account instanceof BotAccount) {
      return {
        ...base,
        owner_id: account.ownerId,
        purpose: account.purpose,
        is_active: account.isActive,
        last_active_at: account.lastActiveAt?.toISOString() || null
      };
    }

    return base;
  }

  /**
   * Map array of rows to array of domain models
   */
  static toDomainArray(rows: AccountRow[]): Account[] {
    return rows.map(row => this.toDomain(row));
  }
}
