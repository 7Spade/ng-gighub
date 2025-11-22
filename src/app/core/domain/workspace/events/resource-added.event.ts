/**
 * Resource Added Event
 * 
 * 當資源被加入工作區時觸發
 */
export class ResourceAddedEvent {
  readonly eventName = 'ResourceAdded';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly resourceType: string,
    public readonly resourceId: string
  ) {
    this.occurredAt = new Date();
  }
}
