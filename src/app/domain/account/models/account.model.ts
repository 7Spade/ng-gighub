import { AccountType } from '../value-objects/account-type.vo';

/**
 * Abstract base class for all Account types
 * Implements common properties and behaviors shared across User, Organization, and Bot accounts
 */
export abstract class Account {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string | null,
    public readonly displayName: string,
    public readonly avatarUrl: string | null,
    public readonly bio: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly type: AccountType
  ) {}

  /**
   * Get the display name or fallback to username
   */
  getDisplayName(): string {
    return this.displayName || this.username;
  }

  /**
   * Check if this account is of a specific type
   */
  isType(type: AccountType): boolean {
    return this.type === type;
  }

  /**
   * Abstract method to be implemented by subclasses
   * Returns type-specific properties
   */
  abstract getTypeSpecificData(): Record<string, unknown>;

  /**
   * Convert account to plain object for serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      bio: this.bio,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      type: this.type,
      ...this.getTypeSpecificData()
    };
  }
}
