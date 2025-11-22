import { ContextType } from '../../../../../core/application/context/models/context.model';

/**
 * 選單項目介面
 */
export interface MenuItem {
  /** 標籤 */
  label: string;
  /** 路由路徑 */
  route: string;
  /** 圖示（可選） */
  icon?: string;
  /** 是否為外部連結 */
  external?: boolean;
}

/**
 * 選單配置
 * 根據不同的上下文類型提供對應的選單項目
 */
export const MENU_CONFIG: Record<ContextType, MenuItem[]> = {
  [ContextType.PERSONAL]: [
    {
      label: '個人資料',
      route: '/account/profile',
      icon: 'person',
    },
    {
      label: '帳戶設定',
      route: '/account/settings',
      icon: 'settings',
    },
  ],

  [ContextType.ORGANIZATION]: [
    {
      label: '組織儀表板',
      route: '/organizations',
      icon: 'dashboard',
    },
    {
      label: '成員管理',
      route: '/organizations/members',
      icon: 'group',
    },
    {
      label: '團隊管理',
      route: '/organizations/teams',
      icon: 'groups',
    },
    {
      label: '機器人',
      route: '/organizations/bots',
      icon: 'smart_toy',
    },
    {
      label: '組織設定',
      route: '/organizations/settings',
      icon: 'settings',
    },
  ],

  [ContextType.TEAM]: [
    {
      label: '團隊概覽',
      route: '/teams/:id',
      icon: 'groups',
    },
    {
      label: '成員',
      route: '/teams/:id/members',
      icon: 'people',
    },
    {
      label: '倉庫',
      route: '/teams/:id/repositories',
      icon: 'folder',
    },
  ],
};

/**
 * 取得指定上下文的選單項目
 * @param contextType 上下文類型
 * @param teamId 團隊 ID（團隊上下文時需要）
 * @returns 選單項目列表
 */
export function getMenuItems(contextType: ContextType, teamId?: string): MenuItem[] {
  const items = MENU_CONFIG[contextType] || [];

  // 如果是團隊上下文，替換路由中的 :id 為實際的 teamId
  if (contextType === ContextType.TEAM && teamId) {
    return items.map((item) => ({
      ...item,
      route: item.route.replace(':id', teamId),
    }));
  }

  return items;
}
