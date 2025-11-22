import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ContextService } from '../../../../../../core/application/context/services/context.service';
import { ContextType, ContextItem } from '../../../../../../core/application/context/models/context.model';

/**
 * Context Switcher Component
 * 用戶頭像和上下文切換器元件
 */
@Component({
  selector: 'app-context-switcher',
  templateUrl: './context-switcher.component.html',
  styleUrls: ['./context-switcher.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class ContextSwitcherComponent {
  private readonly contextService = inject(ContextService);
  private readonly router = inject(Router);

  /** 當前上下文 */
  readonly currentContext = this.contextService.currentContext;

  /** 可用的上下文列表 */
  readonly availableContexts = this.contextService.availableContexts;

  /** 個人上下文項目 */
  readonly personalContexts = signal<ContextItem[]>([]);

  /** 組織上下文項目 */
  readonly organizationContexts = signal<ContextItem[]>([]);

  /** 團隊上下文項目 */
  readonly teamContexts = signal<ContextItem[]>([]);

  /** ContextType enum for template */
  readonly ContextType = ContextType;

  constructor() {
    // 模擬資料 - 實際應從 Supabase 查詢
    this.initializeMockData();
  }

  /**
   * 切換上下文
   */
  switchContext(item: ContextItem): void {
    switch (item.type) {
      case ContextType.PERSONAL:
        this.contextService.switchToPersonal(item.id, item.displayName, item.avatarUrl);
        this.router.navigate(['/account/profile']);
        break;
      case ContextType.ORGANIZATION:
        this.contextService.switchToOrganization(item.id, item.displayName, item.avatarUrl);
        this.router.navigate(['/organizations']);
        break;
      case ContextType.TEAM:
        // 需要從 item 中取得 organizationId
        const orgId = (item as any).organizationId || '';
        this.contextService.switchToTeam(item.id, orgId, item.displayName, item.avatarUrl);
        this.router.navigate(['/teams', item.id]);
        break;
    }
  }

  /**
   * 管理組織
   */
  manageOrganizations(): void {
    this.router.navigate(['/organizations/settings']);
  }

  /**
   * 建立組織
   */
  createOrganization(): void {
    // TODO: 導航到建立組織頁面
    console.log('Create organization');
  }

  /**
   * 檢查是否為當前上下文
   */
  isCurrentContext(item: ContextItem): boolean {
    const current = this.currentContext();
    if (!current) return false;

    switch (item.type) {
      case ContextType.PERSONAL:
        return current.type === ContextType.PERSONAL && current.userId === item.id;
      case ContextType.ORGANIZATION:
        return current.type === ContextType.ORGANIZATION && current.organizationId === item.id;
      case ContextType.TEAM:
        return current.type === ContextType.TEAM && current.teamId === item.id;
      default:
        return false;
    }
  }

  /**
   * 初始化模擬資料
   * TODO: 從 Supabase 查詢實際資料
   */
  private initializeMockData(): void {
    // 個人上下文
    this.personalContexts.set([
      {
        id: 'user-1',
        type: ContextType.PERSONAL,
        displayName: '我的帳戶',
        avatarUrl: undefined
      }
    ]);

    // 組織上下文
    this.organizationContexts.set([
      {
        id: 'org-1',
        type: ContextType.ORGANIZATION,
        displayName: '示例組織',
        avatarUrl: undefined
      }
    ]);

    // 團隊上下文
    this.teamContexts.set([
      {
        id: 'team-1',
        type: ContextType.TEAM,
        displayName: '開發團隊',
        avatarUrl: undefined
      }
    ]);

    // 設定預設上下文（個人上下文）
    const personal = this.personalContexts()[0];
    if (personal && !this.currentContext()) {
      this.contextService.switchToPersonal(personal.id, personal.displayName, personal.avatarUrl);
    }
  }
}
