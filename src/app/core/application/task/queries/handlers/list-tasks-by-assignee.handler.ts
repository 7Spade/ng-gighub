import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ListTasksByAssigneeQuery } from '../list-tasks-by-assignee.query';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskDto } from '../../dto/task.dto';
import { TaskAggregate } from '../../../../domain/task/aggregates/task.aggregate';

/**
 * List Tasks By Assignee Query Handler
 * 列出指派給特定使用者的任務查詢處理器
 */
@Injectable({
  providedIn: 'root',
})
export class ListTasksByAssigneeQueryHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行查詢
   * @param query 查詢物件
   * @returns Observable<TaskDto[]>
   */
  execute(query: ListTasksByAssigneeQuery): Observable<TaskDto[]> {
    try {
      this.validateQuery(query);

      return this.repository.findByAssignee(query.workspaceId, query.assigneeId).pipe(
        map((tasks: TaskAggregate[]) => tasks.map((task) => this.mapToDto(task))),
        catchError((error) => {
          console.error('[ListTasksByAssigneeQueryHandler] Failed to list tasks:', error);
          return throwError(() => new Error(`Failed to list tasks by assignee: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[ListTasksByAssigneeQueryHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateQuery(query: ListTasksByAssigneeQuery): void {
    if (!query.workspaceId) {
      throw new Error('Workspace ID is required');
    }
    if (!query.assigneeId) {
      throw new Error('Assignee ID is required');
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
