/**
 * Account Role Value Object
 * Represents roles within teams and organizations
 */
export enum TeamRole {
  MEMBER = 'member',
  MAINTAINER = 'maintainer',
  ADMIN = 'admin'
}

export enum OrganizationRole {
  MEMBER = 'member',
  BILLING = 'billing',
  OWNER = 'owner'
}

export enum RepositoryPermission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

export function isValidTeamRole(role: string): role is TeamRole {
  return Object.values(TeamRole).includes(role as TeamRole);
}

export function isValidOrganizationRole(role: string): role is OrganizationRole {
  return Object.values(OrganizationRole).includes(role as OrganizationRole);
}

export function isValidRepositoryPermission(permission: string): permission is RepositoryPermission {
  return Object.values(RepositoryPermission).includes(permission as RepositoryPermission);
}
