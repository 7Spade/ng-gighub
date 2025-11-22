/**
 * Delete Task Command
 * 刪除任務指令
 */
export class DeleteTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly deletedBy: string
  ) {}
}
