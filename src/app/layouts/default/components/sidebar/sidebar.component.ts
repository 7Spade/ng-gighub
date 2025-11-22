import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContextService } from '../../../../core/application/context/services/context.service';
import { getMenuItems, MenuItem } from './config/menu.config';

/** Sidebar 元件 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent {
  private readonly contextService = inject(ContextService);

  /** 當前上下文 */
  readonly currentContext = this.contextService.currentContext;

  /** 當前選單項目（根據上下文動態計算） */
  readonly menuItems = computed<MenuItem[]>(() => {
    const context = this.currentContext();
    if (!context) {
      return [];
    }

    return getMenuItems(context.type, context.teamId);
  });

  /** 上下文顯示名稱 */
  readonly contextDisplayName = computed(() => {
    const context = this.currentContext();
    return context?.displayName || '未選擇上下文';
  });
}
