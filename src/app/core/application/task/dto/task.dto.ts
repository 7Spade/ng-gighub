/**
 * Task DTO
 */
export interface TaskDto {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assigneeId?: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Task DTO
 */
export interface CreateTaskDto {
  workspaceId: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assigneeId?: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
}

/**
 * Update Task DTO
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assigneeId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Task Comment DTO
 */
export interface TaskCommentDto {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Task Comment DTO
 */
export interface CreateTaskCommentDto {
  taskId: string;
  authorId: string;
  content: string;
  metadata?: Record<string, unknown>;
}
