import { WorkspaceAggregate } from '../aggregates/workspace.aggregate';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

/**
 * Workspace Repository Interface
 * 
 * 定義工作區持久化的介面
 */
export interface IWorkspaceRepository {
  /**
   * 儲存工作區
   */
  save(workspace: WorkspaceAggregate): Promise<void>;

  /**
   * 根據 ID 查找工作區
   */
  findById(id: WorkspaceId): Promise<WorkspaceAggregate | null>;

  /**
   * 根據 slug 查找工作區
   */
  findBySlug(slug: string): Promise<WorkspaceAggregate | null>;

  /**
   * 根據擁有者 ID 查找工作區列表
   */
  findByOwnerId(ownerId: string): Promise<WorkspaceAggregate[]>;

  /**
   * 根據成員 ID 查找工作區列表
   */
  findByMemberId(accountId: string): Promise<WorkspaceAggregate[]>;

  /**
   * 刪除工作區
   */
  delete(id: WorkspaceId): Promise<void>;

  /**
   * 檢查 slug 是否已存在
   */
  slugExists(slug: string): Promise<boolean>;
}
