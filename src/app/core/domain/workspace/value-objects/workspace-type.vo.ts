/**
 * Workspace Type 值物件
 * 
 * 代表工作區的類型（personal 或 organization）
 */
export type WorkspaceTypeValue = 'personal' | 'organization';

export class WorkspaceType {
  private readonly value: WorkspaceTypeValue;

  private constructor(value: WorkspaceTypeValue) {
    this.value = value;
  }

  /**
   * 建立個人工作區類型
   */
  static createPersonal(): WorkspaceType {
    return new WorkspaceType('personal');
  }

  /**
   * 建立組織工作區類型
   */
  static createOrganization(): WorkspaceType {
    return new WorkspaceType('organization');
  }

  /**
   * 從字串建立 WorkspaceType
   */
  static fromString(value: string): WorkspaceType {
    if (value === 'personal') {
      return WorkspaceType.createPersonal();
    } else if (value === 'organization') {
      return WorkspaceType.createOrganization();
    }
    throw new Error(`Invalid workspace type: ${value}`);
  }

  /**
   * 取得原始值
   */
  getValue(): WorkspaceTypeValue {
    return this.value;
  }

  /**
   * 是否為個人工作區
   */
  isPersonal(): boolean {
    return this.value === 'personal';
  }

  /**
   * 是否為組織工作區
   */
  isOrganization(): boolean {
    return this.value === 'organization';
  }

  /**
   * 比較兩個 WorkspaceType 是否相等
   */
  equals(other: WorkspaceType): boolean {
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
