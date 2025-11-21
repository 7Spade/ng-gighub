import { Account } from './account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * Bot Account Model
 * Represents a bot account owned by a user or organization
 */
export class BotAccount extends Account {
  constructor(
    id: string,
    username: string,
    displayName: string,
    public botType: string,
    public ownerId: string,
    avatarUrl: string | null = null,
    bio: string | null = null,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    metadata: Record<string, any> = {}
  ) {
    super(
      id,
      AccountType.BOT,
      username,
      displayName,
      avatarUrl,
      bio,
      isActive,
      createdAt,
      updatedAt,
      metadata
    );
  }

  /**
   * Validate bot account
   */
  validate(): boolean {
    return (
      this.username.length > 0 &&
      this.displayName.length > 0 &&
      this.botType.length > 0 &&
      this.ownerId.length > 0
    );
  }

  /**
   * Update bot type
   */
  updateBotType(newType: string): void {
    this.botType = newType;
    this.updatedAt = new Date();
  }

  /**
   * Check if the given account is the owner
   */
  isOwnedBy(accountId: string): boolean {
    return this.ownerId === accountId;
  }

  /**
   * Transfer ownership to another account
   */
  transferOwnership(newOwnerId: string): void {
    this.ownerId = newOwnerId;
    this.updatedAt = new Date();
  }
}
