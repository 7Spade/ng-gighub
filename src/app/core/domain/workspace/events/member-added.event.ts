/**
 * Member Added Event
 * 
 * 當成員被加入工作區時觸發
 */
export class MemberAddedEvent {
  readonly eventName = 'MemberAdded';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly accountId: string,
    public readonly role: string
  ) {
    this.occurredAt = new Date();
  }
}
