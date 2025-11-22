import { Injectable, inject } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { CreateTaskCommand } from '../create-task.command';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskAggregate } from '../../../../domain/task/aggregates/task.aggregate';
import { TaskId } from '../../../../domain/task/value-objects/task-id.vo';
import { TaskPriority } from '../../../../domain/task/value-objects/task-priority.vo';

/**
 * Create Task Command Handler
 * 建立任務指令處理器
 *
 * 負責處理建立新任務的業務邏輯
 */
@Injectable({
  providedIn: 'root',
})
export class CreateTaskCommandHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行建立任務指令
   * @param command 建立任務指令
   * @returns Observable<TaskId> 新建任務的 ID
   */
  execute(command: CreateTaskCommand): Observable<TaskId> {
    try {
      // 1. 驗證輸入
      this.validateCommand(command);

      // 2. 創建任務聚合根
      const taskId = TaskId.generate();
      const priority = command.priority
        ? this.mapPriority(command.priority)
        : TaskPriority.createMedium();

      const task = TaskAggregate.create(
        taskId,
        command.workspaceId,
        command.title,
        command.createdBy,
        command.description || undefined,
        priority
      );

      // 3. 設置可選屬性
      if (command.dueDate) {
        task.setDueDate(command.dueDate);
      }
      if (command.assigneeId) {
        task.assignTo(command.assigneeId, command.createdBy);
      }

      // 4. 儲存任務
      return this.repository.save(task).pipe(
        map(() => task.getId()),
        tap((taskId) => {
          console.log(`[CreateTaskCommandHandler] Task created successfully: ${taskId.getValue()}`);
          // TODO: 發布領域事件
        }),
        catchError((error) => {
          console.error('[CreateTaskCommandHandler] Failed to create task:', error);
          return throwError(() => new Error(`Failed to create task: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[CreateTaskCommandHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  /**
   * 驗證指令參數
   */
  private validateCommand(command: CreateTaskCommand): void {
    if (!command.workspaceId) {
      throw new Error('Workspace ID is required');
    }
    if (!command.title || command.title.trim().length === 0) {
      throw new Error('Task title is required');
    }
    if (!command.createdBy) {
      throw new Error('Creator ID is required');
    }
    if (command.title.length > 200) {
      throw new Error('Task title must not exceed 200 characters');
    }
  }

  /**
   * 將字串優先級映射到 TaskPriority Value Object
   */
  private mapPriority(priority: 'low' | 'medium' | 'high' | 'urgent'): TaskPriority {
    switch (priority) {
      case 'low':
        return TaskPriority.createLow();
      case 'medium':
        return TaskPriority.createMedium();
      case 'high':
        return TaskPriority.createHigh();
      case 'urgent':
        return TaskPriority.createUrgent();
      default:
        return TaskPriority.createMedium();
    }
  }
}
