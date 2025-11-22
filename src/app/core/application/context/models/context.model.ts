/**
 * Context 型別定義
 */

/** 上下文類型 */
export enum ContextType {
  /** 個人上下文 */
  PERSONAL = 'personal',
  /** 組織上下文 */
  ORGANIZATION = 'organization',
  /** 團隊上下文 */
  TEAM = 'team'
}

/** 應用程式上下文 */
export interface AppContext {
  /** 上下文類型 */
  type: ContextType;
  /** 使用者 ID（個人上下文時必填） */
  userId?: string;
  /** 組織 ID（組織上下文時必填） */
  organizationId?: string;
  /** 團隊 ID（團隊上下文時必填） */
  teamId?: string;
  /** 顯示名稱 */
  displayName?: string;
  /** 頭像 URL */
  avatarUrl?: string;
}

/** 可切換的上下文項目 */
export interface ContextItem {
  /** 項目 ID */
  id: string;
  /** 上下文類型 */
  type: ContextType;
  /** 顯示名稱 */
  displayName: string;
  /** 頭像 URL */
  avatarUrl?: string;
  /** 是否為當前上下文 */
  isCurrent?: boolean;
}

/** 上下文切換結果 */
export interface ContextSwitchResult {
  /** 是否成功 */
  success: boolean;
  /** 新的上下文 */
  context?: AppContext;
  /** 錯誤訊息 */
  error?: string;
}
