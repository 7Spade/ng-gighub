/**
 * Task Status Value Object
 * 任務狀態
 */
export class TaskStatus {
  private static readonly VALID_STATUSES = ['todo', 'in_progress', 'done', 'cancelled'] as const;
  private readonly value: (typeof TaskStatus.VALID_STATUSES)[number];

  private constructor(value: (typeof TaskStatus.VALID_STATUSES)[number]) {
    this.value = value;
  }

  /**
   * 從字串建立 TaskStatus
   */
  static create(status: string): TaskStatus {
    if (!this.VALID_STATUSES.includes(status as any)) {
      throw new Error(
        `Invalid task status: ${status}. Must be one of: ${this.VALID_STATUSES.join(', ')}`
      );
    }
    return new TaskStatus(status as any);
  }

  /**
   * 建立待辦狀態
   */
  static createTodo(): TaskStatus {
    return new TaskStatus('todo');
  }

  /**
   * 建立進行中狀態
   */
  static createInProgress(): TaskStatus {
    return new TaskStatus('in_progress');
  }

  /**
   * 建立完成狀態
   */
  static createDone(): TaskStatus {
    return new TaskStatus('done');
  }

  /**
   * 建立取消狀態
   */
  static createCancelled(): TaskStatus {
    return new TaskStatus('cancelled');
  }

  getValue(): string {
    return this.value;
  }

  /**
   * 檢查是否可以轉換到目標狀態
   */
  canTransitionTo(targetStatus: TaskStatus): boolean {
    const current = this.value;
    const target = targetStatus.getValue();

    // 定義允許的狀態轉換
    const allowedTransitions: Record<string, string[]> = {
      todo: ['in_progress', 'cancelled'],
      in_progress: ['done', 'todo', 'cancelled'],
      done: ['in_progress'], // 允許重新開啟
      cancelled: ['todo'], // 允許恢復
    };

    return allowedTransitions[current]?.includes(target) ?? false;
  }

  isTodo(): boolean {
    return this.value === 'todo';
  }

  isInProgress(): boolean {
    return this.value === 'in_progress';
  }

  isDone(): boolean {
    return this.value === 'done';
  }

  isCancelled(): boolean {
    return this.value === 'cancelled';
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
