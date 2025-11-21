import { Account } from './account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * User Account Model
 * Represents an individual user account in the system
 */
export class UserAccount extends Account {
  constructor(
    id: string,
    username: string,
    email: string | null,
    displayName: string,
    avatarUrl: string | null,
    bio: string | null,
    createdAt: Date,
    updatedAt: Date,
    public readonly firstName: string | null,
    public readonly lastName: string | null,
    public readonly location: string | null,
    public readonly website: string | null,
    public readonly isVerified: boolean = false
  ) {
    super(id, username, email, displayName, avatarUrl, bio, createdAt, updatedAt, AccountType.USER);
  }

  /**
   * Get full name of the user
   */
  getFullName(): string | null {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName || this.lastName || null;
  }

  /**
   * Get type-specific data for User
   */
  getTypeSpecificData(): Record<string, unknown> {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      location: this.location,
      website: this.website,
      isVerified: this.isVerified
    };
  }
}
