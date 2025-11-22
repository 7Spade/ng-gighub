/**
 * Workspace Deleted Event
 *
 * 當工作區被刪除時觸發
 */
export class WorkspaceDeletedEvent {
  readonly eventName = 'WorkspaceDeleted';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly ownerId: string
  ) {
    this.occurredAt = new Date();
  }
}
