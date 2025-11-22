/**
 * Workspace Slug 值物件
 * 
 * 代表工作區的 URL-friendly 識別碼
 */
export class WorkspaceSlug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * 從字串建立 WorkspaceSlug
   */
  static create(value: string): WorkspaceSlug {
    if (!value || value.trim().length === 0) {
      throw new Error('Workspace slug cannot be empty');
    }

    // 驗證 slug 格式（只允許小寫字母、數字、連字符）
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(value)) {
      throw new Error('Workspace slug can only contain lowercase letters, numbers, and hyphens');
    }

    if (value.length < 3) {
      throw new Error('Workspace slug must be at least 3 characters long');
    }

    if (value.length > 50) {
      throw new Error('Workspace slug must not exceed 50 characters');
    }

    return new WorkspaceSlug(value);
  }

  /**
   * 從名稱自動生成 slug
   */
  static fromName(name: string): WorkspaceSlug {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字元
      .replace(/\s+/g, '-') // 空格轉連字符
      .replace(/-+/g, '-') // 多個連字符合併為一個
      .replace(/^-|-$/g, ''); // 移除頭尾連字符

    return WorkspaceSlug.create(slug);
  }

  /**
   * 取得原始值
   */
  getValue(): string {
    return this.value;
  }

  /**
   * 比較兩個 WorkspaceSlug 是否相等
   */
  equals(other: WorkspaceSlug): boolean {
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
