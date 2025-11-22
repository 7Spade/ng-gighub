/**
 * Member Removed Event
 * 
 * 當成員被移除出工作區時觸發
 */
export class MemberRemovedEvent {
  readonly eventName = 'MemberRemoved';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly accountId: string
  ) {
    this.occurredAt = new Date();
  }
}
