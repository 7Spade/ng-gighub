# Layouts 模組

## 概述

Layouts 定義應用程式的整體佈局結構。不同的頁面類型使用不同的 layout，提供一致的使用者體驗。

## Layout 類型

### default/
**預設佈局**

用於已登入使用者的主要應用程式頁面。

#### 結構
```
┌──────────────────────────┐
│        Header            │
├────────┬─────────────────┤
│ Side   │                 │
│ bar    │    Content      │
│        │ (router-outlet) │
│        │                 │
├────────┴─────────────────┤
│        Footer            │
└──────────────────────────┘
```

#### 元件

- **header/** - 頂部導覽列
  - Logo
  - 全域搜尋
  - 通知
  - 帳號下拉選單

- **sidebar/** - 側邊欄
  - 主選單
  - 快速連結
  - 可折疊

- **footer/** - 頁尾
  - 版權資訊
  - 連結

### auth/
**認證佈局**

用於登入、註冊、忘記密碼等認證相關頁面。

#### 結構
```
┌──────────────────────────┐
│                          │
│                          │
│      Auth Content        │
│   (router-outlet)        │
│                          │
│                          │
└──────────────────────────┘
```

簡潔的置中設計，沒有 header/sidebar/footer。

## 使用方式

### 在路由中設定 Layout

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      // ... 其他需要 default layout 的路由
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      // ... 其他認證頁面
    ]
  }
];
```

### Layout 元件結構

```typescript
@Component({
  selector: 'app-default-layout',
  template: `
    <div class="layout">
      <app-header></app-header>
      <div class="main">
        <app-sidebar></app-sidebar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class DefaultLayoutComponent {}
```

## 響應式設計

所有 layout 都應支援響應式設計：

- **Desktop** (>= 1024px): 完整顯示 header, sidebar, footer
- **Tablet** (768px - 1023px): Sidebar 可折疊
- **Mobile** (< 768px): Sidebar 變為 drawer，header 簡化

## Layout 元件特點

### Header
- 固定在頂部（sticky）
- 包含全域導覽與操作
- 響應式設計，行動版簡化顯示

### Sidebar
- 主要導覽選單
- 可折疊/展開
- 記憶使用者偏好

### Footer
- 固定在底部
- 包含次要資訊與連結
- 行動版可選擇隱藏

## 樣式指南

- 使用 SCSS 變數統一樣式
- 支援主題切換（light/dark mode）
- 遵循 Material Design 或自訂設計系統

## 可擴展性

未來可以新增更多 layout：

- **minimal/** - 極簡佈局（如錯誤頁面）
- **dashboard/** - 儀表板佈局（多欄位）
- **fullscreen/** - 全螢幕佈局（如編輯器）

## 最佳實務

1. **Layout 只負責佈局**: 不包含業務邏輯
2. **子元件獨立**: Header, Sidebar, Footer 都是獨立元件
3. **使用 router-outlet**: 內容區域使用 router-outlet 顯示頁面
4. **統一樣式**: 所有 layout 共用基礎樣式變數
