/**
 * Workspace Created Event
 * 
 * 當工作區被建立時觸發
 */
export class WorkspaceCreatedEvent {
  readonly eventName = 'WorkspaceCreated';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly name: string,
    public readonly type: 'personal' | 'organization',
    public readonly ownerId: string
  ) {
    this.occurredAt = new Date();
  }
}
