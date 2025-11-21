/**
 * Account Data Transfer Object
 * Used for transferring account data between layers
 */
export interface AccountDto {
  id: string;
  type: 'user' | 'organization' | 'bot';
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  isActive: boolean;
  
  // Organization-specific
  organizationName?: string;
  organizationType?: string | null;
  
  // Bot-specific
  botType?: string;
  ownerId?: string;
  
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Convert Account domain model to DTO
 */
export function accountToDto(account: any): AccountDto {
  const base: AccountDto = {
    id: account.id,
    type: account.type,
    username: account.username,
    displayName: account.displayName,
    avatarUrl: account.avatarUrl,
    bio: account.bio,
    isActive: account.isActive,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    metadata: account.metadata
  };

  if (account.type === 'user') {
    return { ...base, email: account.email };
  } else if (account.type === 'organization') {
    return {
      ...base,
      organizationName: account.organizationName,
      organizationType: account.organizationType
    };
  } else if (account.type === 'bot') {
    return {
      ...base,
      botType: account.botType,
      ownerId: account.ownerId
    };
  }

  return base;
}
