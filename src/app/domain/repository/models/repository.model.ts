/**
 * Repository Visibility
 */
export enum RepositoryVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INTERNAL = 'internal'
}

/**
 * Repository Model
 * Represents a code repository
 */
export class Repository {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly fullName: string,
    public readonly description: string | null,
    public readonly ownerId: string,
    public readonly ownerType: 'user' | 'organization',
    public readonly visibility: RepositoryVisibility,
    public readonly defaultBranch: string = 'main',
    public readonly isArchived: boolean = false,
    public readonly isTemplate: boolean = false,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly pushedAt: Date | null = null,
    public readonly starCount: number = 0,
    public readonly forkCount: number = 0,
    public readonly watcherCount: number = 0,
    public readonly openIssueCount: number = 0,
    public readonly language: string | null = null,
    public readonly topics: string[] = [],
    public readonly homepage: string | null = null
  ) {}

  /**
   * Check if repository is public
   */
  isPublic(): boolean {
    return this.visibility === RepositoryVisibility.PUBLIC;
  }

  /**
   * Check if repository is private
   */
  isPrivate(): boolean {
    return this.visibility === RepositoryVisibility.PRIVATE;
  }

  /**
   * Check if repository has activity
   */
  hasRecentActivity(): boolean {
    if (!this.pushedAt) return false;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.pushedAt > thirtyDaysAgo;
  }

  /**
   * Convert to plain object
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      fullName: this.fullName,
      description: this.description,
      ownerId: this.ownerId,
      ownerType: this.ownerType,
      visibility: this.visibility,
      defaultBranch: this.defaultBranch,
      isArchived: this.isArchived,
      isTemplate: this.isTemplate,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      pushedAt: this.pushedAt?.toISOString() || null,
      starCount: this.starCount,
      forkCount: this.forkCount,
      watcherCount: this.watcherCount,
      openIssueCount: this.openIssueCount,
      language: this.language,
      topics: this.topics,
      homepage: this.homepage
    };
  }
}
