import { Repository } from '../../../domain/repository/models/repository.model';
import { Database } from '../database.types';

type RepositoryRow = Database['public']['Tables']['repositories']['Row'];
type RepositoryInsert = Database['public']['Tables']['repositories']['Insert'];

/**
 * Repository Mapper
 * Handles mapping between database rows and Repository domain models
 */
export class RepositoryMapper {
  /**
   * Map database row to domain model
   */
  static toDomain(row: RepositoryRow): Repository {
    return new Repository(
      row.id,
      row.name,
      row.slug,
      row.owner_id,
      row.description,
      row.is_private ?? true,
      row.is_archived ?? false,
      row.default_branch ?? 'main',
      row.created_at ? new Date(row.created_at) : new Date(),
      row.updated_at ? new Date(row.updated_at) : new Date(),
      (row.metadata as Record<string, any>) ?? {}
    );
  }

  /**
   * Map domain model to database insert
   */
  static toInsert(repository: Repository): RepositoryInsert {
    return {
      name: repository.name,
      slug: repository.slug,
      owner_id: repository.ownerId,
      description: repository.description,
      is_private: repository.isPrivate,
      is_archived: repository.isArchived,
      default_branch: repository.defaultBranch,
      metadata: repository.metadata as any
    };
  }

  /**
   * Map domain model to database update
   */
  static toUpdate(repository: Repository): Partial<RepositoryRow> {
    return {
      name: repository.name,
      slug: repository.slug,
      description: repository.description,
      is_private: repository.isPrivate,
      is_archived: repository.isArchived,
      default_branch: repository.defaultBranch,
      metadata: repository.metadata as any,
      updated_at: new Date().toISOString()
    };
  }
}
