import { Account } from '../../../domain/account/models/account.model';
import { UserAccount } from '../../../domain/account/models/user-account.model';
import { OrganizationAccount } from '../../../domain/account/models/organization-account.model';
import { BotAccount } from '../../../domain/account/models/bot-account.model';
import { AccountType } from '../../../domain/account/value-objects/account-type.vo';
import { Database } from '../database.types';

type AccountRow = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];

/**
 * Account Mapper
 * Handles polymorphic mapping between database rows and domain models
 */
export class AccountMapper {
  /**
   * Map database row to domain model (polymorphic)
   */
  static toDomain(row: AccountRow): Account {
    const baseData = {
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      isActive: row.is_active ?? true,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      metadata: (row.metadata as Record<string, any>) ?? {}
    };

    switch (row.type) {
      case AccountType.USER:
        return new UserAccount(
          baseData.id,
          baseData.username,
          baseData.displayName,
          row.email!,
          baseData.avatarUrl,
          baseData.bio,
          baseData.isActive,
          baseData.createdAt,
          baseData.updatedAt,
          baseData.metadata
        );

      case AccountType.ORGANIZATION:
        return new OrganizationAccount(
          baseData.id,
          baseData.username,
          baseData.displayName,
          row.organization_name!,
          row.organization_type,
          baseData.avatarUrl,
          baseData.bio,
          baseData.isActive,
          baseData.createdAt,
          baseData.updatedAt,
          baseData.metadata
        );

      case AccountType.BOT:
        return new BotAccount(
          baseData.id,
          baseData.username,
          baseData.displayName,
          row.bot_type!,
          row.owner_id!,
          baseData.avatarUrl,
          baseData.bio,
          baseData.isActive,
          baseData.createdAt,
          baseData.updatedAt,
          baseData.metadata
        );

      default:
        throw new Error(`Unknown account type: ${row.type}`);
    }
  }

  /**
   * Map domain model to database insert (polymorphic)
   */
  static toInsert(account: Account): AccountInsert {
    const base: AccountInsert = {
      type: account.type,
      username: account.username,
      display_name: account.displayName,
      avatar_url: account.avatarUrl,
      bio: account.bio,
      is_active: account.isActive,
      metadata: account.metadata as any
    };

    if (account.isUser()) {
      return {
        ...base,
        email: account.email
      };
    } else if (account.isOrganization()) {
      return {
        ...base,
        organization_name: account.organizationName,
        organization_type: account.organizationType
      };
    } else if (account.isBot()) {
      return {
        ...base,
        bot_type: account.botType,
        owner_id: account.ownerId
      };
    }

    return base;
  }

  /**
   * Map domain model to database update
   */
  static toUpdate(account: Account): Partial<AccountRow> {
    const base = {
      display_name: account.displayName,
      avatar_url: account.avatarUrl,
      bio: account.bio,
      is_active: account.isActive,
      metadata: account.metadata as any,
      updated_at: new Date().toISOString()
    };

    if (account.isUser()) {
      return {
        ...base,
        email: account.email
      };
    } else if (account.isOrganization()) {
      return {
        ...base,
        organization_name: account.organizationName,
        organization_type: account.organizationType
      };
    } else if (account.isBot()) {
      return {
        ...base,
        bot_type: account.botType,
        owner_id: account.ownerId
      };
    }

    return base;
  }
}
