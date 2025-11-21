/**
 * Account Role Value Object
 * Represents roles that can be assigned to accounts in organizations
 */
export enum AccountRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest'
}

/**
 * Type guard to check if a string is a valid AccountRole
 */
export function isAccountRole(value: string): value is AccountRole {
  return Object.values(AccountRole).includes(value as AccountRole);
}

/**
 * Role hierarchy level for permission checking
 */
export const ROLE_HIERARCHY: Record<AccountRole, number> = {
  [AccountRole.OWNER]: 4,
  [AccountRole.ADMIN]: 3,
  [AccountRole.MEMBER]: 2,
  [AccountRole.GUEST]: 1
};

/**
 * Check if a role has sufficient permissions (equal or higher than required)
 */
export function hasPermission(userRole: AccountRole, requiredRole: AccountRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
