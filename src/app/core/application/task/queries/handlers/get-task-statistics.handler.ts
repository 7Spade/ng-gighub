import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import { GetTaskStatisticsQuery, TaskStatisticsDto } from '../get-task-statistics.query';
import { ITaskRepository } from '../../../../domain/task/repositories/task.repository.interface';
import { TASK_REPOSITORY_TOKEN } from '../../../../domain/task/repositories/task.repository.token';

/**
 * Get Task Statistics Query Handler
 * 取得任務統計查詢處理器
 */
@Injectable({
  providedIn: 'root',
})
export class GetTaskStatisticsQueryHandler {
  private readonly repository = inject(TASK_REPOSITORY_TOKEN);

  /**
   * 執行統計查詢
   * @param query 查詢物件
   * @returns Observable<TaskStatisticsDto>
   */
  execute(query: GetTaskStatisticsQuery): Observable<TaskStatisticsDto> {
    try {
      this.validateQuery(query);

      return this.repository.getStatistics(query.workspaceId).pipe(
        map((stats) => this.mapToDto(stats)),
        catchError((error) => {
          console.error('[GetTaskStatisticsQueryHandler] Failed to get statistics:', error);
          return throwError(() => new Error(`Failed to get task statistics: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('[GetTaskStatisticsQueryHandler] Validation error:', error);
      return throwError(() => error);
    }
  }

  private validateQuery(query: GetTaskStatisticsQuery): void {
    if (!query.workspaceId) {
      throw new Error('Workspace ID is required');
    }
  }

  private mapToDto(stats: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    overdue: number;
    completed: number;
  }): TaskStatisticsDto {
    return {
      total: stats.total,
      byStatus: {
        todo: stats.byStatus['todo'] || 0,
        in_progress: stats.byStatus['in_progress'] || 0,
        done: stats.byStatus['done'] || 0,
        cancelled: stats.byStatus['cancelled'] || 0,
      },
      byPriority: {
        low: stats.byPriority['low'] || 0,
        medium: stats.byPriority['medium'] || 0,
        high: stats.byPriority['high'] || 0,
        urgent: stats.byPriority['urgent'] || 0,
      },
      overdue: stats.overdue,
      completed: stats.completed,
    };
  }
}
