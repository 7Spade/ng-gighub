import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { GetTaskByIdQuery } from '../get-task-by-id.query';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskId } from '../../../../domain/task/value-objects/task-id.vo';
import { TaskDto } from '../../dto/task.dto';
import { TaskAggregate } from '../../../../domain/task/aggregates/task.aggregate';

/**
 * Get Task By ID Query Handler
 * 依 ID 取得任務查詢處理器
 */
@Injectable({
  providedIn: 'root',
})
export class GetTaskByIdQueryHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行查詢
   * @param query 查詢物件
   * @returns Observable<TaskDto | null>
   */
  execute(query: GetTaskByIdQuery): Observable<TaskDto | null> {
    try {
      this.validateQuery(query);

      const taskId = TaskId.create(query.taskId);

      return this.repository.findById(taskId).pipe(
        map((task) => {
          if (!task) {
            return null;
          }
          return this.mapToDto(task);
        }),
        catchError((error) => {
          console.error('[GetTaskByIdQueryHandler] Failed to get task:', error);
          return throwError(() => new Error(`Failed to get task: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[GetTaskByIdQueryHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateQuery(query: GetTaskByIdQuery): void {
    if (!query.taskId) {
      throw new Error('Task ID is required');
    }
  }

  private mapToDto(task: TaskAggregate): TaskDto {
    return {
      id: task.getId().getValue(),
      workspaceId: task.getWorkspaceId(),
      title: task.getTitle(),
      description: task.getDescription() ?? undefined,
      status: task.getStatus().getValue() as 'todo' | 'in_progress' | 'done' | 'cancelled',
      priority: task.getPriority().getValue() as 'low' | 'medium' | 'high' | 'urgent',
      dueDate: task.getDueDate()?.toISOString() ?? undefined,
      assigneeId: task.getAssigneeId() ?? undefined,
      createdBy: task.getCreatedBy(),
      metadata: task.getMetadata(),
      createdAt: task.getCreatedAt().toISOString(),
      updatedAt: task.getUpdatedAt().toISOString(),
    };
  }
}
