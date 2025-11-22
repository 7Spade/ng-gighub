import { MemberRole } from '../value-objects/member-role.vo';

/**
 * Workspace Member 實體
 * 
 * 代表工作區的成員
 */
export class WorkspaceMember {
  private readonly id: string;
  private readonly accountId: string;
  private role: MemberRole;
  private readonly joinedAt: Date;
  private permissions: Record<string, boolean>;

  constructor(
    id: string,
    accountId: string,
    role: MemberRole,
    joinedAt: Date,
    permissions: Record<string, boolean> = {}
  ) {
    this.id = id;
    this.accountId = accountId;
    this.role = role;
    this.joinedAt = joinedAt;
    this.permissions = permissions;
  }

  /**
   * 取得成員 ID
   */
  getId(): string {
    return this.id;
  }

  /**
   * 取得帳號 ID
   */
  getAccountId(): string {
    return this.accountId;
  }

  /**
   * 取得角色
   */
  getRole(): MemberRole {
    return this.role;
  }

  /**
   * 更新角色
   */
  updateRole(newRole: MemberRole): void {
    if (this.role.isOwner()) {
      throw new Error('Cannot change owner role');
    }
    this.role = newRole;
  }

  /**
   * 取得加入時間
   */
  getJoinedAt(): Date {
    return this.joinedAt;
  }

  /**
   * 取得權限設定
   */
  getPermissions(): Record<string, boolean> {
    return { ...this.permissions };
  }

  /**
   * 設定特定權限
   */
  setPermission(permission: string, value: boolean): void {
    this.permissions[permission] = value;
  }

  /**
   * 檢查是否有特定權限
   */
  hasPermission(permission: string): boolean {
    return this.permissions[permission] === true;
  }

  /**
   * 是否為擁有者
   */
  isOwner(): boolean {
    return this.role.isOwner();
  }

  /**
   * 是否可以管理
   */
  canManage(): boolean {
    return this.role.canManage();
  }

  /**
   * 轉換為簡單物件
   */
  toObject(): {
    id: string;
    accountId: string;
    role: string;
    joinedAt: Date;
    permissions: Record<string, boolean>;
  } {
    return {
      id: this.id,
      accountId: this.accountId,
      role: this.role.getValue(),
      joinedAt: this.joinedAt,
      permissions: this.getPermissions(),
    };
  }
}
