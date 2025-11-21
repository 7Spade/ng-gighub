import { Account } from './account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * User Account Model
 * Represents an individual user account
 */
export class UserAccount extends Account {
  constructor(
    id: string,
    username: string,
    displayName: string,
    public email: string,
    avatarUrl: string | null = null,
    bio: string | null = null,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    metadata: Record<string, any> = {}
  ) {
    super(
      id,
      AccountType.USER,
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
   * Validate user account
   */
  validate(): boolean {
    return (
      this.username.length > 0 &&
      this.displayName.length > 0 &&
      this.email.length > 0 &&
      this.isValidEmail(this.email)
    );
  }

  /**
   * Check if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Update email
   */
  updateEmail(newEmail: string): void {
    if (this.isValidEmail(newEmail)) {
      this.email = newEmail;
      this.updatedAt = new Date();
    } else {
      throw new Error('Invalid email format');
    }
  }
}
