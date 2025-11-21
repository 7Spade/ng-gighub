import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';

/**
 * Team Domain Service
 * Handles team-related business logic and validation
 */
@Injectable({
  providedIn: 'root'
})
export class TeamDomainService {
  /**
   * Validate team creation
   */
  validateTeamCreation(team: Team): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!team.name || team.name.length < 2) {
      errors.push('Team name must be at least 2 characters long');
    }

    if (team.name.length > 100) {
      errors.push('Team name must not exceed 100 characters');
    }

    // Slug validation
    if (!team.slug || team.slug.length < 2) {
      errors.push('Team slug must be at least 2 characters long');
    }

    if (!/^[a-z0-9-]+$/.test(team.slug)) {
      errors.push('Team slug can only contain lowercase letters, numbers, and hyphens');
    }

    // Organization validation
    if (!team.organizationId) {
      errors.push('Team must belong to an organization');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate slug from team name
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
