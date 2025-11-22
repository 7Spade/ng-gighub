/**
 * Workspace Resource 實體
 *
 * 代表工作區中的資源（如 team, repository, project 等）
 */
export class WorkspaceResource {
  private readonly id: string;
  private readonly resourceType: string;
  private readonly resourceId: string;
  private metadata: Record<string, any>;
  private readonly createdAt: Date;

  constructor(
    id: string,
    resourceType: string,
    resourceId: string,
    createdAt: Date,
    metadata: Record<string, any> = {}
  ) {
    this.id = id;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.createdAt = createdAt;
    this.metadata = metadata;
  }

  /**
   * 取得資源關聯 ID
   */
  getId(): string {
    return this.id;
  }

  /**
   * 取得資源類型
   */
  getResourceType(): string {
    return this.resourceType;
  }

  /**
   * 取得資源 ID
   */
  getResourceId(): string {
    return this.resourceId;
  }

  /**
   * 取得建立時間
   */
  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * 取得元資料
   */
  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  /**
   * 更新元資料
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  /**
   * 設定特定元資料欄位
   */
  setMetadataField(key: string, value: any): void {
    this.metadata[key] = value;
  }

  /**
   * 取得特定元資料欄位
   */
  getMetadataField(key: string): any {
    return this.metadata[key];
  }

  /**
   * 轉換為簡單物件
   */
  toObject(): {
    id: string;
    resourceType: string;
    resourceId: string;
    createdAt: Date;
    metadata: Record<string, any>;
  } {
    return {
      id: this.id,
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      createdAt: this.createdAt,
      metadata: this.getMetadata(),
    };
  }
}
