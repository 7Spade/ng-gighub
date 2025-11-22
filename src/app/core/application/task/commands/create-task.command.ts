/**
 * Create Task Command
 * 建立任務指令
 */
export class CreateTaskCommand {
  constructor(
    public readonly workspaceId: string,
    public readonly title: string,
    public readonly createdBy: string,
    public readonly description?: string,
    public readonly priority?: 'low' | 'medium' | 'high' | 'urgent',
    public readonly dueDate?: Date,
    public readonly assigneeId?: string
  ) {}
}
