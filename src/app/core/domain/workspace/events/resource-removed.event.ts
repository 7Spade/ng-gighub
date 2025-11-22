/**
 * Resource Removed Event
 * 
 * 當資源被移除出工作區時觸發
 */
export class ResourceRemovedEvent {
  readonly eventName = 'ResourceRemoved';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly resourceType: string,
    public readonly resourceId: string
  ) {
    this.occurredAt = new Date();
  }
}
