/**
 * Task Comment Added Event
 * 任務評論新增事件
 */
export class TaskCommentAddedEvent {
  constructor(
    public readonly taskId: string,
    public readonly commentId: string,
    public readonly authorId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
