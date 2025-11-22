import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { AssignTaskCommand } from '../assign-task.command';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskId } from '../../../../domain/task/value-objects/task-id.vo';

/**
 * Assign Task Command Handler
 * 指派任務指令處理器
 *
 * 負責處理將任務指派給使用者的業務邏輯
 */
@Injectable({
  providedIn: 'root',
})
export class AssignTaskCommandHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行指派任務指令
   * @param command 指派任務指令
   * @returns Observable<void>
   */
  execute(command: AssignTaskCommand): Observable<void> {
    try {
      this.validateCommand(command);

      const taskId = TaskId.create(command.taskId);

      return this.repository.findById(taskId).pipe(
        switchMap((task) => {
          if (!task) {
            throw new Error(`Task not found: ${command.taskId}`);
          }

          // 指派任務
          task.assignTo(command.assigneeId, command.assignedBy);

          return this.repository.update(task);
        }),
        tap(() => {
          console.log(
            `[AssignTaskCommandHandler] Task assigned: ${command.taskId} -> ${command.assigneeId}`
          );
          // TODO: 發布領域事件 TaskAssignedEvent
        }),
        catchError((error) => {
          console.error('[AssignTaskCommandHandler] Failed to assign task:', error);
          return throwError(() => new Error(`Failed to assign task: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[AssignTaskCommandHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateCommand(command: AssignTaskCommand): void {
    if (!command.taskId) {
      throw new Error('Task ID is required');
    }
    if (!command.assigneeId) {
      throw new Error('Assignee ID is required');
    }
  }
}
