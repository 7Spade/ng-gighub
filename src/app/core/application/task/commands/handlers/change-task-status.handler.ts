import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { ChangeTaskStatusCommand } from '../change-task-status.command';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskId } from '../../../../domain/task/value-objects/task-id.vo';
import { TaskStatus } from '../../../../domain/task/value-objects/task-status.vo';

/**
 * Change Task Status Command Handler
 * 變更任務狀態指令處理器
 *
 * 負責處理變更任務狀態的業務邏輯，包含狀態轉換驗證
 */
@Injectable({
  providedIn: 'root',
})
export class ChangeTaskStatusCommandHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行變更任務狀態指令
   * @param command 變更狀態指令
   * @returns Observable<void>
   */
  execute(command: ChangeTaskStatusCommand): Observable<void> {
    try {
      this.validateCommand(command);

      const taskId = TaskId.create(command.taskId);
      const newStatus = this.mapStatus(command.newStatus);

      return this.repository.findById(taskId).pipe(
        switchMap((task) => {
          if (!task) {
            throw new Error(`Task not found: ${command.taskId}`);
          }

          // 變更狀態（包含狀態機驗證）
          task.changeStatus(newStatus, command.changedBy);

          return this.repository.update(task);
        }),
        tap(() => {
          console.log(
            `[ChangeTaskStatusCommandHandler] Task status changed: ${command.taskId} -> ${command.newStatus}`
          );
          // TODO: 發布領域事件 TaskStatusChangedEvent
        }),
        catchError((error) => {
          console.error('[ChangeTaskStatusCommandHandler] Failed to change task status:', error);
          return throwError(() => new Error(`Failed to change task status: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[ChangeTaskStatusCommandHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateCommand(command: ChangeTaskStatusCommand): void {
    if (!command.taskId) {
      throw new Error('Task ID is required');
    }
    if (!command.newStatus) {
      throw new Error('New status is required');
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
}
