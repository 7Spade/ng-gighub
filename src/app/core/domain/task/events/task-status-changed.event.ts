/**
 * Task Status Changed Event
 * 任務狀態變更事件
 */
export class TaskStatusChangedEvent {
  constructor(
    public readonly taskId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string,
    public readonly changedBy: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
