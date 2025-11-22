/**
 * Task ID Value Object
 * 任務唯一識別碼
 */
export class TaskId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * 從 UUID 字串建立 TaskId
   */
  static create(id: string): TaskId {
    if (!id || id.trim() === '') {
      throw new Error('Task ID cannot be empty');
    }

    // 驗證 UUID 格式
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      throw new Error('Invalid Task ID format. Must be a valid UUID');
    }

    return new TaskId(id);
  }

  /**
   * 產生新的 TaskId
   */
  static generate(): TaskId {
    return new TaskId(crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
