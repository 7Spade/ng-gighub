/**
 * List Tasks By Status Query
 * 依狀態列出任務查詢
 */
export class ListTasksByStatusQuery {
  constructor(
    public readonly workspaceId: string,
    public readonly status: 'todo' | 'in_progress' | 'done' | 'cancelled'
  ) {}
}
