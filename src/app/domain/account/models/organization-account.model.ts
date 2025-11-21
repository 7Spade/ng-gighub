import { Account } from './account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * Organization Account Model
 * Represents an organization account that can contain teams and members
 */
export class OrganizationAccount extends Account {
  constructor(
    id: string,
    username: string,
    displayName: string,
    public organizationName: string,
    public organizationType: string | null = null,
    avatarUrl: string | null = null,
    bio: string | null = null,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    metadata: Record<string, any> = {}
  ) {
    super(
      id,
      AccountType.ORGANIZATION,
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
   * Validate organization account
   */
  validate(): boolean {
    return (
      this.username.length > 0 &&
      this.displayName.length > 0 &&
      this.organizationName.length > 0
    );
  }

  /**
   * Update organization information
   */
  updateOrganizationInfo(name?: string, type?: string): void {
    if (name !== undefined) {
      this.organizationName = name;
    }
    if (type !== undefined) {
      this.organizationType = type;
    }
    this.updatedAt = new Date();
  }

  /**
   * Get organization type or default
   */
  getOrganizationType(): string {
    return this.organizationType || 'company';
  }
}
