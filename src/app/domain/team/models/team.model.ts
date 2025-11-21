/**
 * Team Domain Model
 * Represents a team within an organization
 */
export class Team {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public readonly organizationId: string,
    public description: string | null = null,
    public avatarUrl: string | null = null,
    public isPublic: boolean = false,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public metadata: Record<string, any> = {}
  ) {}

  /**
   * Validate team
   */
  validate(): boolean {
    return (
      this.name.length > 0 &&
      this.slug.length > 0 &&
      this.organizationId.length > 0 &&
      this.isValidSlug(this.slug)
    );
  }

  /**
   * Check if slug is valid (lowercase alphanumeric with hyphens)
   */
  private isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug);
  }

  /**
   * Update team information
   */
  update(updates: Partial<Pick<Team, 'name' | 'slug' | 'description' | 'avatarUrl' | 'isPublic' | 'metadata'>>): void {
    if (updates.name !== undefined) {
      this.name = updates.name;
    }
    if (updates.slug !== undefined && this.isValidSlug(updates.slug)) {
      this.slug = updates.slug;
    }
    if (updates.description !== undefined) {
      this.description = updates.description;
    }
    if (updates.avatarUrl !== undefined) {
      this.avatarUrl = updates.avatarUrl;
    }
    if (updates.isPublic !== undefined) {
      this.isPublic = updates.isPublic;
    }
    if (updates.metadata !== undefined) {
      this.metadata = { ...this.metadata, ...updates.metadata };
    }
    this.updatedAt = new Date();
  }

  /**
   * Make team public
   */
  makePublic(): void {
    this.isPublic = true;
    this.updatedAt = new Date();
  }

  /**
   * Make team private
   */
  makePrivate(): void {
    this.isPublic = false;
    this.updatedAt = new Date();
  }

  /**
   * Generate full team identifier
   */
  getFullIdentifier(organizationUsername: string): string {
    return `@${organizationUsername}/${this.slug}`;
  }
}
