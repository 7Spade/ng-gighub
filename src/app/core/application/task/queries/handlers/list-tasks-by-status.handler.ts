import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ListTasksByStatusQuery } from '../list-tasks-by-status.query';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskStatus } from '../../../../domain/task/value-objects/task-status.vo';
import { TaskDto } from '../../dto/task.dto';
import { TaskAggregate } from '../../../../domain/task/aggregates/task.aggregate';

/**
 * List Tasks By Status Query Handler
 * 依狀態列出任務查詢處理器
 */
@Injectable({
  providedIn: 'root',
})
export class ListTasksByStatusQueryHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行查詢
   * @param query 查詢物件
   * @returns Observable<TaskDto[]>
   */
  execute(query: ListTasksByStatusQuery): Observable<TaskDto[]> {
    try {
      this.validateQuery(query);

      const status = this.mapStatus(query.status);

      return this.repository.findByStatus(query.workspaceId, status).pipe(
        map((tasks: TaskAggregate[]) => tasks.map((task) => this.mapToDto(task))),
        catchError((error) => {
          console.error('[ListTasksByStatusQueryHandler] Failed to list tasks:', error);
          return throwError(() => new Error(`Failed to list tasks by status: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[ListTasksByStatusQueryHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateQuery(query: ListTasksByStatusQuery): void {
    if (!query.workspaceId) {
      throw new Error('Workspace ID is required');
    }
    if (!query.status) {
      throw new Error('Status is required');
    }
  }

  private mapStatus(status: 'todo' | 'in_progress' | 'done' | 'cancelled'): TaskStatus {
    switch (status) {
      case 'todo':
        return TaskStatus.createTodo();
      case 'in_progress':
        return TaskStatus.createInProgress();
      case 'done':
        return TaskStatus.createDone();
      case 'cancelled':
        return TaskStatus.createCancelled();
      default:
        throw new Error(`Invalid status: ${status}`);
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
