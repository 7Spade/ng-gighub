import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { UpdateTaskCommand } from '../update-task.command';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskId } from '../../../../domain/task/value-objects/task-id.vo';
import { TaskPriority } from '../../../../domain/task/value-objects/task-priority.vo';

/**
 * Update Task Command Handler
 * 更新任務指令處理器
 *
 * 負責處理更新任務的業務邏輯
 */
@Injectable({
  providedIn: 'root',
})
export class UpdateTaskCommandHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行更新任務指令
   * @param command 更新任務指令
   * @returns Observable<void>
   */
  execute(command: UpdateTaskCommand): Observable<void> {
    try {
      this.validateCommand(command);

      const taskId = TaskId.create(command.taskId);

      return this.repository.findById(taskId).pipe(
        switchMap((task) => {
          if (!task) {
            throw new Error(`Task not found: ${command.taskId}`);
          }

          // 應用更新
          if (command.title !== undefined) {
            task.updateTitle(command.title);
          }
          if (command.description !== undefined) {
            task.updateDescription(command.description);
          }
          if (command.priority !== undefined) {
            const priority = this.mapPriority(command.priority);
            task.changePriority(priority);
          }
          if (command.dueDate !== undefined) {
            task.setDueDate(command.dueDate);
          }

          return this.repository.update(task);
        }),
        tap(() => {
          console.log(`[UpdateTaskCommandHandler] Task updated successfully: ${command.taskId}`);
          // TODO: 發布領域事件
        }),
        catchError((error) => {
          console.error('[UpdateTaskCommandHandler] Failed to update task:', error);
          return throwError(() => new Error(`Failed to update task: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[UpdateTaskCommandHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateCommand(command: UpdateTaskCommand): void {
    if (!command.taskId) {
      throw new Error('Task ID is required');
    }
    if (command.title !== undefined && command.title.length > 200) {
      throw new Error('Task title must not exceed 200 characters');
    }
  }

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
