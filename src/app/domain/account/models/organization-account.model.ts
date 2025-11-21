import { Account } from './account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * Organization Account Model
 * Represents an organization account that can have members and teams
 */
export class OrganizationAccount extends Account {
  constructor(
    id: string,
    username: string,
    email: string | null,
    displayName: string,
    avatarUrl: string | null,
    bio: string | null,
    createdAt: Date,
    updatedAt: Date,
    public readonly companyName: string | null,
    public readonly website: string | null,
    public readonly location: string | null,
    public readonly memberCount: number = 0,
    public readonly teamCount: number = 0,
    public readonly isVerified: boolean = false
  ) {
    super(id, username, email, displayName, avatarUrl, bio, createdAt, updatedAt, AccountType.ORGANIZATION);
  }

  /**
   * Get type-specific data for Organization
   */
  getTypeSpecificData(): Record<string, unknown> {
    return {
      companyName: this.companyName,
      website: this.website,
      location: this.location,
      memberCount: this.memberCount,
      teamCount: this.teamCount,
      isVerified: this.isVerified
    };
  }

  /**
   * Check if organization has members
   */
  hasMembers(): boolean {
    return this.memberCount > 0;
  }

  /**
   * Check if organization has teams
   */
  hasTeams(): boolean {
    return this.teamCount > 0;
  }
}
