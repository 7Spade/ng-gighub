import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
import { TaskPriority } from '../value-objects/task-priority.vo';
import { TaskComment } from '../entities/task-comment.entity';
import { TaskCreatedEvent } from '../events/task-created.event';
import { TaskStatusChangedEvent } from '../events/task-status-changed.event';
import { TaskAssignedEvent } from '../events/task-assigned.event';
import { TaskCommentAddedEvent } from '../events/task-comment-added.event';
import { TaskDeletedEvent } from '../events/task-deleted.event';

/**
 * Task Aggregate Root
 * 任務聚合根
 *
 * 代表一個任務，管理任務的狀態、優先級、指派、評論等
 */
export class TaskAggregate {
  private readonly id: TaskId;
  private readonly workspaceId: string;
  private title: string;
  private description: string | null;
  private status: TaskStatus;
  private priority: TaskPriority;
  private dueDate: Date | null;
  private assigneeId: string | null;
  private readonly createdBy: string;
  private metadata: Record<string, any>;
  private readonly createdAt: Date;
  private updatedAt: Date;

  // 聚合內的集合
  private comments: Map<string, TaskComment>;

  // 領域事件收集
  private domainEvents: any[];

  private constructor(
    id: TaskId,
    workspaceId: string,
    title: string,
    createdBy: string,
    description: string | null = null,
    status: TaskStatus = TaskStatus.createTodo(),
    priority: TaskPriority = TaskPriority.createMedium(),
    dueDate: Date | null = null,
    assigneeId: string | null = null,
    metadata: Record<string, any> = {},
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.validateTitle(title);

    this.id = id;
    this.workspaceId = workspaceId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.dueDate = dueDate;
    this.assigneeId = assigneeId;
    this.createdBy = createdBy;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.comments = new Map();
    this.domainEvents = [];
  }

  /**
   * 建立新任務
   */
  static create(
    id: TaskId,
    workspaceId: string,
    title: string,
    createdBy: string,
    description?: string,
    priority?: TaskPriority
  ): TaskAggregate {
    const task = new TaskAggregate(
      id,
      workspaceId,
      title,
      createdBy,
      description || null,
      TaskStatus.createTodo(),
      priority || TaskPriority.createMedium()
    );

    // 發布領域事件
    task.addDomainEvent(
      new TaskCreatedEvent(id.getValue(), workspaceId, title, createdBy)
    );

    return task;
  }

  /**
   * 從持久化資料重建任務
   */
  static reconstitute(
    id: TaskId,
    workspaceId: string,
    title: string,
    createdBy: string,
    description: string | null,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: Date | null,
    assigneeId: string | null,
    metadata: Record<string, any>,
    createdAt: Date,
    updatedAt: Date
  ): TaskAggregate {
    return new TaskAggregate(
      id,
      workspaceId,
      title,
      createdBy,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
      metadata,
      createdAt,
      updatedAt
    );
  }

  /**
   * 驗證標題
   */
  private validateTitle(title: string): void {
    if (!title || title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }

    if (title.length > 200) {
      throw new Error('Task title too long. Maximum 200 characters');
    }
  }

  /**
   * 驗證描述
   */
  private validateDescription(description: string): void {
    if (description.length > 5000) {
      throw new Error('Task description too long. Maximum 5000 characters');
    }
  }

  /**
   * 更新標題
   */
  updateTitle(newTitle: string): void {
    this.validateTitle(newTitle);
    this.title = newTitle;
    this.markAsUpdated();
  }

  /**
   * 更新描述
   */
  updateDescription(newDescription: string): void {
    this.validateDescription(newDescription);
    this.description = newDescription;
    this.markAsUpdated();
  }

  /**
   * 變更狀態
   */
  changeStatus(newStatus: TaskStatus, changedBy: string): void {
    if (this.status.equals(newStatus)) {
      return; // 狀態相同，無需變更
    }

    // 檢查是否允許此狀態轉換
    if (!this.status.canTransitionTo(newStatus)) {
      throw new Error(
        `Cannot transition from ${this.status.getValue()} to ${newStatus.getValue()}`
      );
    }

    const oldStatus = this.status.getValue();
    this.status = newStatus;
    this.markAsUpdated();

    // 發布領域事件
    this.addDomainEvent(
      new TaskStatusChangedEvent(
        this.id.getValue(),
        oldStatus,
        newStatus.getValue(),
        changedBy
      )
    );
  }

  /**
   * 變更優先級
   */
  changePriority(newPriority: TaskPriority): void {
    if (this.priority.equals(newPriority)) {
      return; // 優先級相同，無需變更
    }

    this.priority = newPriority;
    this.markAsUpdated();
  }

  /**
   * 設定到期日
   */
  setDueDate(dueDate: Date | null): void {
    // 驗證到期日不能在過去
    if (dueDate && dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    this.dueDate = dueDate;
    this.markAsUpdated();
  }

  /**
   * 指派任務
   */
  assignTo(assigneeId: string, assignedBy: string): void {
    if (this.assigneeId === assigneeId) {
      return; // 已指派給同一人，無需變更
    }

    this.assigneeId = assigneeId;
    this.markAsUpdated();

    // 發布領域事件
    this.addDomainEvent(
      new TaskAssignedEvent(this.id.getValue(), assigneeId, assignedBy)
    );
  }

  /**
   * 取消指派
   */
  unassign(): void {
    this.assigneeId = null;
    this.markAsUpdated();
  }

  /**
   * 新增評論
   */
  addComment(authorId: string, content: string): TaskComment {
    const comment = TaskComment.create(authorId, content);
    this.comments.set(comment.getId(), comment);
    this.markAsUpdated();

    // 發布領域事件
    this.addDomainEvent(
      new TaskCommentAddedEvent(this.id.getValue(), comment.getId(), authorId)
    );

    return comment;
  }

  /**
   * 更新評論
   */
  updateComment(commentId: string, newContent: string, userId: string): void {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // 檢查是否為評論作者
    if (!comment.isAuthoredBy(userId)) {
      throw new Error('Only comment author can update the comment');
    }

    comment.updateContent(newContent);
    this.markAsUpdated();
  }

  /**
   * 刪除評論
   */
  deleteComment(commentId: string, userId: string): void {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // 檢查是否為評論作者或任務建立者
    if (!comment.isAuthoredBy(userId) && userId !== this.createdBy) {
      throw new Error('Only comment author or task creator can delete the comment');
    }

    this.comments.delete(commentId);
    this.markAsUpdated();
  }

  /**
   * 更新 metadata
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.markAsUpdated();
  }

  /**
   * 刪除任務（軟刪除）
   */
  delete(deletedBy: string): void {
    // 發布領域事件
    this.addDomainEvent(
      new TaskDeletedEvent(this.id.getValue(), this.workspaceId, deletedBy)
    );
  }

  /**
   * 標記為已更新
   */
  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }

  /**
   * 新增領域事件
   */
  private addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }

  // Getters
  getId(): TaskId {
    return this.id;
  }

  getWorkspaceId(): string {
    return this.workspaceId;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string | null {
    return this.description;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getPriority(): TaskPriority {
    return this.priority;
  }

  getDueDate(): Date | null {
    return this.dueDate;
  }

  getAssigneeId(): string | null {
    return this.assigneeId;
  }

  getCreatedBy(): string {
    return this.createdBy;
  }

  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getComments(): TaskComment[] {
    return Array.from(this.comments.values());
  }

  getDomainEvents(): any[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  /**
   * 檢查任務是否已過期
   */
  isOverdue(): boolean {
    if (!this.dueDate) {
      return false;
    }
    return this.dueDate < new Date() && !this.status.isDone() && !this.status.isCancelled();
  }

  /**
   * 檢查任務是否已指派
   */
  isAssigned(): boolean {
    return this.assigneeId !== null;
  }

  /**
   * 檢查任務是否已完成
   */
  isCompleted(): boolean {
    return this.status.isDone();
  }

  /**
   * 檢查使用者是否為任務建立者
   */
  isCreatedBy(userId: string): boolean {
    return this.createdBy === userId;
  }

  /**
   * 檢查使用者是否為任務指派者
   */
  isAssignedTo(userId: string): boolean {
    return this.assigneeId === userId;
  }
}
