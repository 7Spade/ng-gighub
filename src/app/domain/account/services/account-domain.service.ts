import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IAccountRepository } from '../repositories/account.repository.interface';
import { Account } from '../models/account.model';
import { UserAccount } from '../models/user-account.model';
import { OrganizationAccount } from '../models/organization-account.model';
import { BotAccount } from '../models/bot-account.model';
import { AccountType } from '../value-objects/account-type.vo';

/**
 * Domain Service for Account business logic
 * Handles account-related operations and business rules
 */
@Injectable({
  providedIn: 'root'
})
export class AccountDomainService {
  /**
   * Validate account creation rules
   */
  validateAccountCreation(account: Account): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Username validation
    if (!account.username || account.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(account.username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    // Display name validation
    if (!account.displayName || account.displayName.length < 2) {
      errors.push('Display name must be at least 2 characters long');
    }

    // Type-specific validation
    if (account instanceof UserAccount) {
      if (account.email && !this.isValidEmail(account.email)) {
        errors.push('Invalid email format');
      }
    } else if (account instanceof OrganizationAccount) {
      if (!account.companyName || account.companyName.length < 2) {
        errors.push('Company name must be at least 2 characters long');
      }
    } else if (account instanceof BotAccount) {
      if (!account.ownerId) {
        errors.push('Bot account must have an owner');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if user can access account (for account switching)
   */
  canAccessAccount(userId: string, account: Account): boolean {
    // User can always access their own account
    if (account.id === userId && account.type === AccountType.USER) {
      return true;
    }

    // For organizations, need to check membership (will be handled by application layer)
    // For now, return false as placeholder
    return false;
  }

  /**
   * Generate username suggestion from display name
   */
  generateUsernameSuggestion(displayName: string): string {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
