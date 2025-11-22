/**
 * Workspace Member Role 值物件
 *
 * 代表工作區成員的角色
 */
export type MemberRoleValue = 'owner' | 'admin' | 'member' | 'viewer';

export class MemberRole {
  private readonly value: MemberRoleValue;

  private constructor(value: MemberRoleValue) {
    this.value = value;
  }

  /**
   * 建立擁有者角色
   */
  static createOwner(): MemberRole {
    return new MemberRole('owner');
  }

  /**
   * 建立管理員角色
   */
  static createAdmin(): MemberRole {
    return new MemberRole('admin');
  }

  /**
   * 建立成員角色
   */
  static createMember(): MemberRole {
    return new MemberRole('member');
  }

  /**
   * 建立瀏覽者角色
   */
  static createViewer(): MemberRole {
    return new MemberRole('viewer');
  }

  /**
   * 從字串建立 MemberRole
   */
  static fromString(value: string): MemberRole {
    switch (value) {
      case 'owner':
        return MemberRole.createOwner();
      case 'admin':
        return MemberRole.createAdmin();
      case 'member':
        return MemberRole.createMember();
      case 'viewer':
        return MemberRole.createViewer();
      default:
        throw new Error(`Invalid member role: ${value}`);
    }
  }

  /**
   * 取得原始值
   */
  getValue(): MemberRoleValue {
    return this.value;
  }

  /**
   * 是否為擁有者
   */
  isOwner(): boolean {
    return this.value === 'owner';
  }

  /**
   * 是否為管理員
   */
  isAdmin(): boolean {
    return this.value === 'admin';
  }

  /**
   * 是否有管理權限（擁有者或管理員）
   */
  canManage(): boolean {
    return this.value === 'owner' || this.value === 'admin';
  }

  /**
   * 是否可以編輯（成員以上）
   */
  canEdit(): boolean {
    return this.value !== 'viewer';
  }

  /**
   * 比較兩個 MemberRole 是否相等
   */
  equals(other: MemberRole): boolean {
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
