/**
 * Task Created Event
 * 任務建立事件
 */
export class TaskCreatedEvent {
  constructor(
    public readonly taskId: string,
    public readonly workspaceId: string,
    public readonly title: string,
    public readonly createdBy: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
