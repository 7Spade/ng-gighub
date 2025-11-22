import { Observable } from 'rxjs';
import { TaskAggregate } from '../aggregates/task.aggregate';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
import { TaskPriority } from '../value-objects/task-priority.vo';

/**
 * Task Repository Interface
 * 任務儲存庫介面
 *
 * 定義任務持久化操作的契約
 */
export interface ITaskRepository {
  /**
   * 取得任務
   */
  findById(id: TaskId): Observable<TaskAggregate | null>;

  /**
   * 取得工作區的所有任務
   */
  findByWorkspaceId(workspaceId: string): Observable<TaskAggregate[]>;

  /**
   * 依狀態取得任務
   */
  findByStatus(workspaceId: string, status: TaskStatus): Observable<TaskAggregate[]>;

  /**
   * 取得指派給特定使用者的任務
   */
  findByAssignee(workspaceId: string, assigneeId: string): Observable<TaskAggregate[]>;

  /**
   * 取得特定使用者建立的任務
   */
  findByCreator(workspaceId: string, creatorId: string): Observable<TaskAggregate[]>;

  /**
   * 搜尋任務（依標題或描述）
   */
  search(workspaceId: string, searchTerm: string): Observable<TaskAggregate[]>;

  /**
   * 儲存任務
   */
  save(task: TaskAggregate): Observable<void>;

  /**
   * 更新任務
   */
  update(task: TaskAggregate): Observable<void>;

  /**
   * 刪除任務
   */
  delete(id: TaskId): Observable<void>;

  /**
   * 取得工作區的任務統計
   */
  getStatistics(workspaceId: string): Observable<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    overdue: number;
    completed: number;
  }>;
}
