/**
 * Task Deleted Event
 * 任務刪除事件
 */
export class TaskDeletedEvent {
  constructor(
    public readonly taskId: string,
    public readonly workspaceId: string,
    public readonly deletedBy: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
