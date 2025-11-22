/**
 * Get Task Statistics Query
 * 取得任務統計查詢
 *
 * 取得工作區的任務統計資訊，包含總數、各狀態數量、優先級分布等
 */
export class GetTaskStatisticsQuery {
  constructor(public readonly workspaceId: string) {}
}

/**
 * Task Statistics DTO
 * 任務統計資料傳輸物件
 */
export interface TaskStatisticsDto {
  total: number;
  byStatus: {
    todo: number;
    in_progress: number;
    done: number;
    cancelled: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  overdue: number;
  completed: number;
}
