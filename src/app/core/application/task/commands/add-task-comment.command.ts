/**
 * Add Task Comment Command
 * 新增任務評論指令
 */
export class AddTaskCommentCommand {
  constructor(
    public readonly taskId: string,
    public readonly authorId: string,
    public readonly content: string
  ) {}
}
