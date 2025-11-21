/**
 * Repository Domain Model
 * Represents a code repository
 */
export class Repository {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public readonly ownerId: string,
    public description: string | null = null,
    public isPrivate: boolean = true,
    public isArchived: boolean = false,
    public defaultBranch: string = 'main',
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public metadata: Record<string, any> = {}
  ) {}

  /**
   * Validate repository
   */
  validate(): boolean {
    return (
      this.name.length > 0 &&
      this.slug.length > 0 &&
      this.ownerId.length > 0 &&
      this.isValidSlug(this.slug) &&
      this.defaultBranch.length > 0
    );
  }

  /**
   * Check if slug is valid (lowercase alphanumeric with hyphens/underscores)
   */
  private isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9_-]+$/;
    return slugRegex.test(slug);
  }

  /**
   * Update repository information
   */
  update(updates: Partial<Pick<Repository, 'name' | 'slug' | 'description' | 'isPrivate' | 'defaultBranch' | 'metadata'>>): void {
    if (updates.name !== undefined) {
      this.name = updates.name;
    }
    if (updates.slug !== undefined && this.isValidSlug(updates.slug)) {
      this.slug = updates.slug;
    }
    if (updates.description !== undefined) {
      this.description = updates.description;
    }
    if (updates.isPrivate !== undefined) {
      this.isPrivate = updates.isPrivate;
    }
    if (updates.defaultBranch !== undefined) {
      this.defaultBranch = updates.defaultBranch;
    }
    if (updates.metadata !== undefined) {
      this.metadata = { ...this.metadata, ...updates.metadata };
    }
    this.updatedAt = new Date();
  }

  /**
   * Archive repository
   */
  archive(): void {
    this.isArchived = true;
    this.updatedAt = new Date();
  }

  /**
   * Unarchive repository
   */
  unarchive(): void {
    this.isArchived = false;
    this.updatedAt = new Date();
  }

  /**
   * Make repository public
   */
  makePublic(): void {
    this.isPrivate = false;
    this.updatedAt = new Date();
  }

  /**
   * Make repository private
   */
  makePrivate(): void {
    this.isPrivate = true;
    this.updatedAt = new Date();
  }

  /**
   * Generate full repository identifier
   */
  getFullIdentifier(ownerUsername: string): string {
    return `${ownerUsername}/${this.slug}`;
  }

  /**
   * Check if repository is active (not archived)
   */
  isActive(): boolean {
    return !this.isArchived;
  }
}
