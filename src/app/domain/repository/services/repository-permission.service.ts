import { Injectable } from '@angular/core';
import { AccountRole } from '../../account/value-objects/account-role.vo';

/**
 * Repository Permission Service
 * Handles repository permission checks and access control
 */
@Injectable({
  providedIn: 'root'
})
export class RepositoryPermissionService {
  /**
   * Check if user can read repository
   */
  canRead(userRole: AccountRole | null, isPublic: boolean): boolean {
    // Public repositories can be read by anyone
    if (isPublic) {
      return true;
    }

    // Private repositories require at least guest role
    return userRole !== null;
  }

  /**
   * Check if user can write to repository
   */
  canWrite(userRole: AccountRole | null): boolean {
    // Need at least member role to write
    return userRole !== null && 
           [AccountRole.MEMBER, AccountRole.ADMIN, AccountRole.OWNER].includes(userRole);
  }

  /**
   * Check if user can admin repository
   */
  canAdmin(userRole: AccountRole | null): boolean {
    // Need admin or owner role
    return userRole !== null && 
           [AccountRole.ADMIN, AccountRole.OWNER].includes(userRole);
  }

  /**
   * Check if user can delete repository
   */
  canDelete(userRole: AccountRole | null): boolean {
    // Only owner can delete
    return userRole === AccountRole.OWNER;
  }

  /**
   * Check if user can manage repository settings
   */
  canManageSettings(userRole: AccountRole | null): boolean {
    return this.canAdmin(userRole);
  }

  /**
   * Check if user can manage collaborators
   */
  canManageCollaborators(userRole: AccountRole | null): boolean {
    return this.canAdmin(userRole);
  }
}
