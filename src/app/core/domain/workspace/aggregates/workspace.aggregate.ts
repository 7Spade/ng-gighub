import { WorkspaceId } from '../value-objects/workspace-id.vo';
import { WorkspaceType } from '../value-objects/workspace-type.vo';
import { WorkspaceSlug } from '../value-objects/workspace-slug.vo';
import { MemberRole } from '../value-objects/member-role.vo';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { WorkspaceResource } from '../entities/workspace-resource.entity';
import { WorkspaceCreatedEvent } from '../events/workspace-created.event';
import { WorkspaceUpdatedEvent } from '../events/workspace-updated.event';
import { WorkspaceDeletedEvent } from '../events/workspace-deleted.event';
import { MemberAddedEvent } from '../events/member-added.event';
import { MemberRemovedEvent } from '../events/member-removed.event';
import { MemberRoleChangedEvent } from '../events/member-role-changed.event';
import { ResourceAddedEvent } from '../events/resource-added.event';
import { ResourceRemovedEvent } from '../events/resource-removed.event';

/**
 * Workspace 聚合根
 *
 * 代表一個工作區，管理工作區的基本資訊、成員和資源
 */
export class WorkspaceAggregate {
  private readonly id: WorkspaceId;
  private type: WorkspaceType;
  private name: string;
  private slug: WorkspaceSlug;
  private description: string | null;
  private readonly ownerId: string;
  private avatarUrl: string | null;
  private settings: Record<string, any>;
  private metadata: Record<string, any>;
  private isActive: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  // 聚合內的集合
  private members: Map<string, WorkspaceMember>;
  private resources: Map<string, WorkspaceResource>;

  // 領域事件收集
  private domainEvents: any[];

  private constructor(
    id: WorkspaceId,
    type: WorkspaceType,
    name: string,
    slug: WorkspaceSlug,
    ownerId: string,
    description: string | null = null,
    avatarUrl: string | null = null,
    settings: Record<string, any> = {},
    metadata: Record<string, any> = {},
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.slug = slug;
    this.ownerId = ownerId;
    this.description = description;
    this.avatarUrl = avatarUrl;
    this.settings = settings;
    this.metadata = metadata;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.members = new Map();
    this.resources = new Map();
    this.domainEvents = [];
  }

  /**
   * 建立新的工作區
   */
  static create(
    id: WorkspaceId,
    type: WorkspaceType,
    name: string,
    slug: WorkspaceSlug,
    ownerId: string,
    description?: string
  ): WorkspaceAggregate {
    const workspace = new WorkspaceAggregate(id, type, name, slug, ownerId, description || null);

    // 自動將擁有者加入為成員
    const ownerMember = new WorkspaceMember(
      crypto.randomUUID(),
      ownerId,
      MemberRole.createOwner(),
      new Date()
    );
    workspace.members.set(ownerId, ownerMember);

    // 發布領域事件
    workspace.addDomainEvent(
      new WorkspaceCreatedEvent(id.getValue(), name, type.getValue(), ownerId)
    );

    return workspace;
  }

  /**
   * 從持久化層重建工作區
   */
  static reconstruct(
    id: WorkspaceId,
    type: WorkspaceType,
    name: string,
    slug: WorkspaceSlug,
    ownerId: string,
    description: string | null,
    avatarUrl: string | null,
    settings: Record<string, any>,
    metadata: Record<string, any>,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    members: WorkspaceMember[] = [],
    resources: WorkspaceResource[] = []
  ): WorkspaceAggregate {
    const workspace = new WorkspaceAggregate(
      id,
      type,
      name,
      slug,
      ownerId,
      description,
      avatarUrl,
      settings,
      metadata,
      isActive,
      createdAt,
      updatedAt
    );

    // 重建成員集合
    members.forEach((member) => {
      workspace.members.set(member.getAccountId(), member);
    });

    // 重建資源集合
    resources.forEach((resource) => {
      workspace.resources.set(resource.getId(), resource);
    });

    return workspace;
  }

  // ========== Getters ==========

  getId(): WorkspaceId {
    return this.id;
  }

  getType(): WorkspaceType {
    return this.type;
  }

  getName(): string {
    return this.name;
  }

  getSlug(): WorkspaceSlug {
    return this.slug;
  }

  getDescription(): string | null {
    return this.description;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  getSettings(): Record<string, any> {
    return { ...this.settings };
  }

  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getMembers(): WorkspaceMember[] {
    return Array.from(this.members.values());
  }

  getResources(): WorkspaceResource[] {
    return Array.from(this.resources.values());
  }

  getDomainEvents(): any[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  // ========== Business Methods ==========

  /**
   * 更新工作區名稱
   */
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Workspace name cannot be empty');
    }

    if (newName.length > 100) {
      throw new Error('Workspace name must not exceed 100 characters');
    }

    this.name = newName;
    this.updatedAt = new Date();
    this.addDomainEvent(new WorkspaceUpdatedEvent(this.id.getValue(), ['name']));
  }

  /**
   * 更新工作區描述
   */
  updateDescription(description: string | null): void {
    this.description = description;
    this.updatedAt = new Date();
    this.addDomainEvent(new WorkspaceUpdatedEvent(this.id.getValue(), ['description']));
  }

  /**
   * 更新工作區頭像
   */
  updateAvatarUrl(avatarUrl: string | null): void {
    this.avatarUrl = avatarUrl;
    this.updatedAt = new Date();
    this.addDomainEvent(new WorkspaceUpdatedEvent(this.id.getValue(), ['avatarUrl']));
  }

  /**
   * 更新設定
   */
  updateSettings(settings: Record<string, any>): void {
    this.settings = { ...this.settings, ...settings };
    this.updatedAt = new Date();
    this.addDomainEvent(new WorkspaceUpdatedEvent(this.id.getValue(), ['settings']));
  }

  /**
   * 更新元資料
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.updatedAt = new Date();
    this.addDomainEvent(new WorkspaceUpdatedEvent(this.id.getValue(), ['metadata']));
  }

  /**
   * 停用工作區
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
    this.addDomainEvent(new WorkspaceUpdatedEvent(this.id.getValue(), ['isActive']));
  }

  /**
   * 啟用工作區
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
    this.addDomainEvent(new WorkspaceUpdatedEvent(this.id.getValue(), ['isActive']));
  }

  /**
   * 刪除工作區（軟刪除）
   */
  delete(): void {
    this.isActive = false;
    this.addDomainEvent(new WorkspaceDeletedEvent(this.id.getValue(), this.ownerId));
  }

  // ========== Member Management ==========

  /**
   * 新增成員
   */
  addMember(memberId: string, accountId: string, role: MemberRole): void {
    // 檢查成員是否已存在
    if (this.members.has(accountId)) {
      throw new Error('Member already exists in workspace');
    }

    const member = new WorkspaceMember(memberId, accountId, role, new Date());

    this.members.set(accountId, member);
    this.updatedAt = new Date();

    this.addDomainEvent(new MemberAddedEvent(this.id.getValue(), accountId, role.getValue()));
  }

  /**
   * 移除成員
   */
  removeMember(accountId: string): void {
    // 不能移除擁有者
    if (accountId === this.ownerId) {
      throw new Error('Cannot remove workspace owner');
    }

    const member = this.members.get(accountId);
    if (!member) {
      throw new Error('Member not found in workspace');
    }

    this.members.delete(accountId);
    this.updatedAt = new Date();

    this.addDomainEvent(new MemberRemovedEvent(this.id.getValue(), accountId));
  }

  /**
   * 變更成員角色
   */
  changeMemberRole(accountId: string, newRole: MemberRole): void {
    const member = this.members.get(accountId);
    if (!member) {
      throw new Error('Member not found in workspace');
    }

    const oldRole = member.getRole();
    member.updateRole(newRole);
    this.updatedAt = new Date();

    this.addDomainEvent(
      new MemberRoleChangedEvent(
        this.id.getValue(),
        accountId,
        oldRole.getValue(),
        newRole.getValue()
      )
    );
  }

  /**
   * 取得特定成員
   */
  getMember(accountId: string): WorkspaceMember | undefined {
    return this.members.get(accountId);
  }

  /**
   * 檢查是否為成員
   */
  isMember(accountId: string): boolean {
    return this.members.has(accountId);
  }

  /**
   * 檢查是否為擁有者
   */
  isOwner(accountId: string): boolean {
    return accountId === this.ownerId;
  }

  /**
   * 取得成員數量
   */
  getMemberCount(): number {
    return this.members.size;
  }

  // ========== Resource Management ==========

  /**
   * 新增資源
   */
  addResource(
    resourceId: string,
    resourceType: string,
    targetResourceId: string,
    metadata: Record<string, any> = {}
  ): void {
    const resource = new WorkspaceResource(
      resourceId,
      resourceType,
      targetResourceId,
      new Date(),
      metadata
    );

    this.resources.set(resourceId, resource);
    this.updatedAt = new Date();

    this.addDomainEvent(new ResourceAddedEvent(this.id.getValue(), resourceType, targetResourceId));
  }

  /**
   * 移除資源
   */
  removeResource(resourceId: string): void {
    const resource = this.resources.get(resourceId);
    if (!resource) {
      throw new Error('Resource not found in workspace');
    }

    this.resources.delete(resourceId);
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ResourceRemovedEvent(
        this.id.getValue(),
        resource.getResourceType(),
        resource.getResourceId()
      )
    );
  }

  /**
   * 取得特定資源
   */
  getResource(resourceId: string): WorkspaceResource | undefined {
    return this.resources.get(resourceId);
  }

  /**
   * 根據類型取得資源列表
   */
  getResourcesByType(resourceType: string): WorkspaceResource[] {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.getResourceType() === resourceType
    );
  }

  /**
   * 取得資源數量
   */
  getResourceCount(): number {
    return this.resources.size;
  }

  // ========== Private Methods ==========

  private addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }
}
