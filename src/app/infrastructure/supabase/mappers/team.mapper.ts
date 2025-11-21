import { Team } from '../../../domain/team/models/team.model';
import { Database } from '../database.types';

type TeamRow = Database['public']['Tables']['teams']['Row'];
type TeamInsert = Database['public']['Tables']['teams']['Insert'];

/**
 * Team Mapper
 * Handles mapping between database rows and Team domain models
 */
export class TeamMapper {
  /**
   * Map database row to domain model
   */
  static toDomain(row: TeamRow): Team {
    return new Team(
      row.id,
      row.name,
      row.slug,
      row.organization_id,
      row.description,
      row.avatar_url,
      row.is_public ?? false,
      row.created_at ? new Date(row.created_at) : new Date(),
      row.updated_at ? new Date(row.updated_at) : new Date(),
      (row.metadata as Record<string, any>) ?? {}
    );
  }

  /**
   * Map domain model to database insert
   */
  static toInsert(team: Team): TeamInsert {
    return {
      name: team.name,
      slug: team.slug,
      organization_id: team.organizationId,
      description: team.description,
      avatar_url: team.avatarUrl,
      is_public: team.isPublic,
      metadata: team.metadata as any
    };
  }

  /**
   * Map domain model to database update
   */
  static toUpdate(team: Team): Partial<TeamRow> {
    return {
      name: team.name,
      slug: team.slug,
      description: team.description,
      avatar_url: team.avatarUrl,
      is_public: team.isPublic,
      metadata: team.metadata as any,
      updated_at: new Date().toISOString()
    };
  }
}
