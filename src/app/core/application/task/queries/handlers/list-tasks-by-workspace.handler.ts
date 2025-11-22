import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ListTasksByWorkspaceQuery } from '../list-tasks-by-workspace.query';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskDto } from '../../dto/task.dto';
import { TaskAggregate } from '../../../../domain/task/aggregates/task.aggregate';

/**
 * List Tasks By Workspace Query Handler
 * 列出工作區任務查詢處理器
 */
@Injectable({
  providedIn: 'root',
})
export class ListTasksByWorkspaceQueryHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行查詢
   * @param query 查詢物件
   * @returns Observable<TaskDto[]>
   */
  execute(query: ListTasksByWorkspaceQuery): Observable<TaskDto[]> {
    try {
      this.validateQuery(query);

      return this.repository.findByWorkspaceId(query.workspaceId).pipe(
        map((tasks: TaskAggregate[]) => tasks.map((task) => this.mapToDto(task))),
        catchError((error) => {
          console.error('[ListTasksByWorkspaceQueryHandler] Failed to list tasks:', error);
          return throwError(() => new Error(`Failed to list tasks: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[ListTasksByWorkspaceQueryHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateQuery(query: ListTasksByWorkspaceQuery): void {
    if (!query.workspaceId) {
      throw new Error('Workspace ID is required');
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
