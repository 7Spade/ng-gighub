/**
 * List Tasks By Assignee Query
 * 列出指派給特定使用者的任務查詢
 */
export class ListTasksByAssigneeQuery {
  constructor(
    public readonly workspaceId: string,
    public readonly assigneeId: string
  ) {}
}
