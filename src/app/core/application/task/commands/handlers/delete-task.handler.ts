import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { DeleteTaskCommand } from '../delete-task.command';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskId } from '../../../../domain/task/value-objects/task-id.vo';

/**
 * Delete Task Command Handler
 * 刪除任務指令處理器
 *
 * 負責處理刪除任務的業務邏輯
 */
@Injectable({
  providedIn: 'root',
})
export class DeleteTaskCommandHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行刪除任務指令
   * @param command 刪除任務指令
   * @returns Observable<void>
   */
  execute(command: DeleteTaskCommand): Observable<void> {
    try {
      this.validateCommand(command);

      const taskId = TaskId.create(command.taskId);

      return this.repository.findById(taskId).pipe(
        switchMap((task) => {
          if (!task) {
            throw new Error(`Task not found: ${command.taskId}`);
          }

          // 標記任務為已刪除（領域邏輯）
          task.delete(command.deletedBy);

          // 執行刪除
          return this.repository.delete(taskId);
        }),
        tap(() => {
          console.log(`[DeleteTaskCommandHandler] Task deleted: ${command.taskId}`);
          // TODO: 發布領域事件 TaskDeletedEvent
        }),
        catchError((error) => {
          console.error('[DeleteTaskCommandHandler] Failed to delete task:', error);
          return throwError(() => new Error(`Failed to delete task: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[DeleteTaskCommandHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateCommand(command: DeleteTaskCommand): void {
    if (!command.taskId) {
      throw new Error('Task ID is required');
    }
  }
}
