/**
 * Workspace DTO
 */
export interface WorkspaceDto {
  id: string;
  type: 'personal' | 'organization';
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  avatarUrl?: string;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Workspace DTO
 */
export interface CreateWorkspaceDto {
  type: 'personal' | 'organization';
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  avatarUrl?: string;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Update Workspace DTO
 */
export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
  avatarUrl?: string;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
}

/**
 * Workspace with Member Info DTO
 */
export interface WorkspaceWithMemberDto extends WorkspaceDto {
  memberRole?: 'owner' | 'admin' | 'member' | 'viewer';
  memberCount?: number;
}
