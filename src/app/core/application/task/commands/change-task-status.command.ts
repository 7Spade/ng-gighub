/**
 * Change Task Status Command
 * 變更任務狀態指令
 */
export class ChangeTaskStatusCommand {
  constructor(
    public readonly taskId: string,
    public readonly newStatus: 'todo' | 'in_progress' | 'done' | 'cancelled',
    public readonly changedBy: string
  ) {}
}
