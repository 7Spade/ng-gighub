/**
 * Task Comment Entity
 * 任務評論實體
 */
export class TaskComment {
  private readonly id: string;
  private readonly authorId: string;
  private content: string;
  private metadata: Record<string, any>;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    authorId: string,
    content: string,
    metadata: Record<string, any> = {},
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.validateContent(content);

    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * 建立新評論
   */
  static create(authorId: string, content: string): TaskComment {
    return new TaskComment(crypto.randomUUID(), authorId, content);
  }

  /**
   * 驗證評論內容
   */
  private validateContent(content: string): void {
    if (!content || content.trim() === '') {
      throw new Error('Comment content cannot be empty');
    }

    if (content.length > 10000) {
      throw new Error('Comment content too long. Maximum 10000 characters');
    }
  }

  /**
   * 更新評論內容
   */
  updateContent(newContent: string): void {
    this.validateContent(newContent);
    this.content = newContent;
    this.updatedAt = new Date();
  }

  /**
   * 更新 metadata
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.updatedAt = new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getContent(): string {
    return this.content;
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

  /**
   * 檢查評論是否已被修改
   */
  isEdited(): boolean {
    return this.updatedAt.getTime() !== this.createdAt.getTime();
  }

  /**
   * 檢查評論是否由指定使用者建立
   */
  isAuthoredBy(userId: string): boolean {
    return this.authorId === userId;
  }
}
