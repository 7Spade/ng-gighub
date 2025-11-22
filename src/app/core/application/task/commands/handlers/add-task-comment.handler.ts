import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { AddTaskCommentCommand } from '../add-task-comment.command';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';
import { TaskId } from '../../../../domain/task/value-objects/task-id.vo';

/**
 * Add Task Comment Command Handler
 * 新增任務評論指令處理器
 *
 * 負責處理新增任務評論的業務邏輯
 */
@Injectable({
  providedIn: 'root',
})
export class AddTaskCommentCommandHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行新增評論指令
   * @param command 新增評論指令
   * @returns Observable<void>
   */
  execute(command: AddTaskCommentCommand): Observable<void> {
    try {
      this.validateCommand(command);

      const taskId = TaskId.create(command.taskId);

      return this.repository.findById(taskId).pipe(
        switchMap((task) => {
          if (!task) {
            throw new Error(`Task not found: ${command.taskId}`);
          }

          // 新增評論
          task.addComment(command.authorId, command.content);

          return this.repository.update(task);
        }),
        tap(() => {
          console.log(`[AddTaskCommentCommandHandler] Comment added to task: ${command.taskId}`);
          // TODO: 發布領域事件 TaskCommentAddedEvent
        }),
        catchError((error) => {
          console.error('[AddTaskCommentCommandHandler] Failed to add comment:', error);
          return throwError(() => new Error(`Failed to add comment: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[AddTaskCommentCommandHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateCommand(command: AddTaskCommentCommand): void {
    if (!command.taskId) {
      throw new Error('Task ID is required');
    }
    if (!command.authorId) {
      throw new Error('Author ID is required');
    }
    if (!command.content || command.content.trim().length === 0) {
      throw new Error('Comment content is required');
    }
    if (command.content.length > 10000) {
      throw new Error('Comment content must not exceed 10,000 characters');
    }
  }
}
