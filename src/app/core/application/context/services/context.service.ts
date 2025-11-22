import { Injectable, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { AppContext, ContextType, ContextItem, ContextSwitchResult } from '../models/context.model';

/**
 * Context Service
 * 管理應用程式上下文狀態（個人、組織、團隊）
 */
@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'ng-gighub-context';

  /** 當前上下文（使用 Signal） */
  private readonly _currentContext = signal<AppContext | null>(null);

  /** 可用的上下文列表 */
  private readonly _availableContexts = signal<ContextItem[]>([]);

  /** 公開的當前上下文（唯讀） */
  readonly currentContext = this._currentContext.asReadonly();

  /** 公開的可用上下文列表（唯讀） */
  readonly availableContexts = this._availableContexts.asReadonly();

  /** 當前上下文類型（計算屬性） */
  readonly contextType = computed(() => this.currentContext()?.type ?? ContextType.PERSONAL);

  /** 是否為個人上下文 */
  readonly isPersonalContext = computed(() => this.contextType() === ContextType.PERSONAL);

  /** 是否為組織上下文 */
  readonly isOrganizationContext = computed(() => this.contextType() === ContextType.ORGANIZATION);

  /** 是否為團隊上下文 */
  readonly isTeamContext = computed(() => this.contextType() === ContextType.TEAM);

  constructor() {
    // 從 LocalStorage 載入上下文（僅在瀏覽器環境）
    if (isPlatformBrowser(this.platformId)) {
      this.loadContextFromStorage();
    }

    // 當上下文改變時，儲存到 LocalStorage
    effect(() => {
      const context = this._currentContext();
      if (context && isPlatformBrowser(this.platformId)) {
        this.saveContextToStorage(context);
      }
    });
  }

  /**
   * 初始化上下文
   * @param userId 使用者 ID
   * @param userDisplayName 使用者顯示名稱
   * @param userAvatarUrl 使用者頭像 URL
   */
  initializeContext(userId: string, userDisplayName: string, userAvatarUrl?: string): void {
    // 如果沒有當前上下文，設定為個人上下文
    if (!this._currentContext()) {
      this.switchToPersonal(userId, userDisplayName, userAvatarUrl);
    }
  }

  /**
   * 設定可用的上下文列表
   * @param contexts 上下文列表
   */
  setAvailableContexts(contexts: ContextItem[]): void {
    this._availableContexts.set(contexts);
  }

  /**
   * 切換到個人上下文
   */
  switchToPersonal(userId: string, displayName: string, avatarUrl?: string): ContextSwitchResult {
    const context: AppContext = {
      type: ContextType.PERSONAL,
      userId,
      displayName,
      avatarUrl,
    };

    this._currentContext.set(context);

    return {
      success: true,
      context,
    };
  }

  /**
   * 切換到組織上下文
   */
  switchToOrganization(
    organizationId: string,
    displayName: string,
    avatarUrl?: string
  ): ContextSwitchResult {
    const context: AppContext = {
      type: ContextType.ORGANIZATION,
      organizationId,
      displayName,
      avatarUrl,
    };

    this._currentContext.set(context);

    return {
      success: true,
      context,
    };
  }

  /**
   * 切換到團隊上下文
   */
  switchToTeam(
    teamId: string,
    organizationId: string,
    displayName: string,
    avatarUrl?: string
  ): ContextSwitchResult {
    const context: AppContext = {
      type: ContextType.TEAM,
      teamId,
      organizationId,
      displayName,
      avatarUrl,
    };

    this._currentContext.set(context);

    return {
      success: true,
      context,
    };
  }

  /**
   * 從 LocalStorage 載入上下文
   */
  private loadContextFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const context = JSON.parse(stored) as AppContext;
        this._currentContext.set(context);
      }
    } catch (error) {
      console.error('Failed to load context from storage:', error);
    }
  }

  /**
   * 儲存上下文到 LocalStorage
   */
  private saveContextToStorage(context: AppContext): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(context));
    } catch (error) {
      console.error('Failed to save context to storage:', error);
    }
  }

  /**
   * 清除上下文
   */
  clearContext(): void {
    this._currentContext.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
