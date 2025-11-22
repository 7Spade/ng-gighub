/**
 * Task Assigned Event
 * 任務指派事件
 */
export class TaskAssignedEvent {
  constructor(
    public readonly taskId: string,
    public readonly assigneeId: string,
    public readonly assignedBy: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
