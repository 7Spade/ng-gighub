/**
 * Workspace ID 值物件
 *
 * 代表工作區的唯一識別碼
 */
export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * 從字串建立 WorkspaceId
   */
  static create(value: string): WorkspaceId {
    if (!value || value.trim().length === 0) {
      throw new Error('Workspace ID cannot be empty');
    }

    // 驗證 UUID 格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('Invalid Workspace ID format');
    }

    return new WorkspaceId(value);
  }

  /**
   * 取得原始值
   */
  getValue(): string {
    return this.value;
  }

  /**
   * 比較兩個 WorkspaceId 是否相等
   */
  equals(other: WorkspaceId): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  /**
   * 轉換為字串
   */
  toString(): string {
    return this.value;
  }
}
