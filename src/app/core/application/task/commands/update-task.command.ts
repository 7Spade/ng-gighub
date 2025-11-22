/**
 * Update Task Command
 * 更新任務指令
 */
export class UpdateTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly updatedBy: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly priority?: 'low' | 'medium' | 'high' | 'urgent',
    public readonly dueDate?: Date | null
  ) {}
}
