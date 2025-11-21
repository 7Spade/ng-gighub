/**
 * Team Model
 * Represents a team within an organization
 */
export class Team {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly organizationId: string,
    public readonly memberCount: number = 0,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly avatarUrl: string | null = null,
    public readonly isPrivate: boolean = false
  ) {}

  /**
   * Get display name for the team
   */
  getDisplayName(): string {
    return this.name;
  }

  /**
   * Check if team has members
   */
  hasMembers(): boolean {
    return this.memberCount > 0;
  }

  /**
   * Convert to plain object
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      organizationId: this.organizationId,
      memberCount: this.memberCount,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      avatarUrl: this.avatarUrl,
      isPrivate: this.isPrivate
    };
  }
}
