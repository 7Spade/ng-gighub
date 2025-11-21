import { AccountType } from '../value-objects/account-type.vo';

/**
 * Abstract Base Account Model
 * Represents the common properties and behavior of all account types
 */
export abstract class Account {
  constructor(
    public readonly id: string,
    public readonly type: AccountType,
    public readonly username: string,
    public displayName: string,
    public avatarUrl: string | null = null,
    public bio: string | null = null,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public metadata: Record<string, any> = {}
  ) {}

  /**
   * Abstract method to validate account-specific rules
   */
  abstract validate(): boolean;

  /**
   * Get display identifier for the account
   */
  getDisplayIdentifier(): string {
    return `@${this.username}`;
  }

  /**
   * Check if account is a user
   */
  isUser(): this is import('./user-account.model').UserAccount {
    return this.type === AccountType.USER;
  }

  /**
   * Check if account is an organization
   */
  isOrganization(): this is import('./organization-account.model').OrganizationAccount {
    return this.type === AccountType.ORGANIZATION;
  }

  /**
   * Check if account is a bot
   */
  isBot(): this is import('./bot-account.model').BotAccount {
    return this.type === AccountType.BOT;
  }

  /**
   * Update account information
   */
  update(updates: Partial<Pick<Account, 'displayName' | 'avatarUrl' | 'bio' | 'metadata'>>): void {
    if (updates.displayName !== undefined) {
      this.displayName = updates.displayName;
    }
    if (updates.avatarUrl !== undefined) {
      this.avatarUrl = updates.avatarUrl;
    }
    if (updates.bio !== undefined) {
      this.bio = updates.bio;
    }
    if (updates.metadata !== undefined) {
      this.metadata = { ...this.metadata, ...updates.metadata };
    }
    this.updatedAt = new Date();
  }

  /**
   * Deactivate account
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Activate account
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
