/**
 * Assign Task Command
 * 指派任務指令
 */
export class AssignTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly assigneeId: string,
    public readonly assignedBy: string
  ) {}
}
