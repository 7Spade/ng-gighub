/**
 * Workspace Updated Event
 *
 * 當工作區資訊被更新時觸發
 */
export class WorkspaceUpdatedEvent {
  readonly eventName = 'WorkspaceUpdated';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly updatedFields: string[]
  ) {
    this.occurredAt = new Date();
  }
}
