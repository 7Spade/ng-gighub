import { Account } from './account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * Bot Account Model
 * Represents a bot/service account in the system
 */
export class BotAccount extends Account {
  constructor(
    id: string,
    username: string,
    email: string | null,
    displayName: string,
    avatarUrl: string | null,
    bio: string | null,
    createdAt: Date,
    updatedAt: Date,
    public readonly ownerId: string,
    public readonly purpose: string | null,
    public readonly isActive: boolean = true,
    public readonly lastActiveAt: Date | null = null
  ) {
    super(id, username, email, displayName, avatarUrl, bio, createdAt, updatedAt, AccountType.BOT);
  }

  /**
   * Get type-specific data for Bot
   */
  getTypeSpecificData(): Record<string, unknown> {
    return {
      ownerId: this.ownerId,
      purpose: this.purpose,
      isActive: this.isActive,
      lastActiveAt: this.lastActiveAt?.toISOString() || null
    };
  }

  /**
   * Check if bot is currently active
   */
  isCurrentlyActive(): boolean {
    return this.isActive;
  }
}
