import { Team } from '../../../domain/team/models/team.model';

/**
 * Database row interface for teams
 */
export interface TeamRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organization_id: string;
  member_count: number;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  is_private: boolean;
}

/**
 * Team Mapper
 * Maps between Team domain models and database rows
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
      row.description,
      row.organization_id,
      row.member_count,
      new Date(row.created_at),
      new Date(row.updated_at),
      row.avatar_url,
      row.is_private
    );
  }

  /**
   * Map domain model to database row
   */
  static toPersistence(team: Team): Partial<TeamRow> {
    return {
      id: team.id || undefined,
      name: team.name,
      slug: team.slug,
      description: team.description,
      organization_id: team.organizationId,
      member_count: team.memberCount,
      created_at: team.createdAt.toISOString(),
      updated_at: team.updatedAt.toISOString(),
      avatar_url: team.avatarUrl,
      is_private: team.isPrivate
    };
  }

  /**
   * Map array of rows to array of domain models
   */
  static toDomainArray(rows: TeamRow[]): Team[] {
    return rows.map(row => this.toDomain(row));
  }
}
