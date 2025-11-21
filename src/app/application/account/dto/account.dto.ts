import { AccountType } from '../../../domain/account/value-objects/account-type.vo';

/**
 * Account DTO for data transfer
 */
export interface AccountDto {
  id: string;
  username: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  type: AccountType;
  createdAt: string;
  updatedAt: string;
  
  // Type-specific fields (optional based on type)
  firstName?: string | null;
  lastName?: string | null;
  location?: string | null;
  website?: string | null;
  isVerified?: boolean;
  companyName?: string | null;
  memberCount?: number;
  teamCount?: number;
  ownerId?: string;
  purpose?: string | null;
  isActive?: boolean;
  lastActiveAt?: string | null;
}

/**
 * Create User Account DTO
 */
export interface CreateUserAccountDto {
  username: string;
  email: string | null;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
}

/**
 * Create Organization Account DTO
 */
export interface CreateOrganizationAccountDto {
  username: string;
  email: string | null;
  displayName: string;
  companyName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
}

/**
 * Create Bot Account DTO
 */
export interface CreateBotAccountDto {
  username: string;
  displayName: string;
  ownerId: string;
  purpose?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

/**
 * Update Account DTO
 */
export interface UpdateAccountDto {
  id: string;
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  email?: string | null;
  
  // Type-specific updates
  firstName?: string | null;
  lastName?: string | null;
  location?: string | null;
  website?: string | null;
  companyName?: string | null;
  purpose?: string | null;
  isActive?: boolean;
}
