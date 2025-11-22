/**
 * File DTO
 */
export interface FileDto {
  id: string;
  workspaceId: string;
  name: string;
  path: string;
  size: number;
  mimeType?: string;
  storagePath: string;
  uploadedBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create File DTO
 */
export interface CreateFileDto {
  workspaceId: string;
  name: string;
  path: string;
  size: number;
  mimeType?: string;
  storagePath: string;
  uploadedBy: string;
  metadata?: Record<string, unknown>;
}

/**
 * Update File DTO
 */
export interface UpdateFileDto {
  name?: string;
  path?: string;
  metadata?: Record<string, unknown>;
}
