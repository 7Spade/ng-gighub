/**
 * Member Role Changed Event
 *
 * 當成員角色被變更時觸發
 */
export class MemberRoleChangedEvent {
  readonly eventName = 'MemberRoleChanged';
  readonly occurredAt: Date;

  constructor(
    public readonly workspaceId: string,
    public readonly accountId: string,
    public readonly oldRole: string,
    public readonly newRole: string
  ) {
    this.occurredAt = new Date();
  }
}
