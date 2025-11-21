# Features 層（展示層）

## 概述

Features 層是應用程式的展示層，包含所有面向使用者的 UI 元件與頁面。每個 feature 代表一個功能模組，遵循 Angular 的模組化設計原則。

## 架構原則

- **功能導向**: 按業務功能組織，而非技術類型
- **Smart & Dumb Components**: 區分容器元件（pages）與展示元件（components）
- **狀態管理**: 使用 Store 集中管理狀態
- **路由**: 每個 feature 有自己的路由配置

## 資料夾結構

每個 feature 遵循相同的結構：

### pages/
**Smart Components** - 容器元件

- 負責資料獲取與狀態管理
- 與 Application 層的 Service 互動
- 組合多個 Dumb Components
- 處理路由參數

### components/
**Dumb Components** - 展示元件

- 純展示邏輯，透過 `@Input` 接收資料
- 透過 `@Output` 發送事件
- 可重複使用
- 不直接與 Application 層互動

### state/
**狀態管理**

- 管理 feature 的本地狀態
- 可使用 NgRx Signal Store、RxJS BehaviorSubject 等
- 與 Application Service 整合

### *.module.ts
**Feature Module**

- 整合該 feature 的所有元件
- 配置路由
- 提供 feature 特定的服務

## 四大 Features

### account/
**帳號管理功能**

- **Pages**: 
  - account-profile - 個人資料頁面
  - account-settings - 設定頁面
  - account-switcher - 帳號切換頁面

- **Components**:
  - account-card - 帳號卡片
  - account-avatar - 頭像元件
  - account-dropdown - 帳號下拉選單

- **State**:
  - current-account.store - 當前帳號狀態
  - accessible-accounts.store - 可存取帳號列表
  - account-switcher.store - 切換相關狀態

### organization/
**組織管理功能**

- **Pages**:
  - organization-dashboard - 儀表板
  - organization-members - 成員管理
  - organization-teams - 團隊管理
  - organization-bots - Bot 管理
  - organization-settings - 組織設定

- **Components**:
  - member-list - 成員列表
  - member-invite - 邀請成員
  - team-card - 團隊卡片
  - bot-card - Bot 卡片

- **State**:
  - organization.store - 組織狀態
  - members.store - 成員狀態
  - teams.store - 團隊狀態

### team/
**團隊管理功能**

- **Pages**:
  - team-detail - 團隊詳情
  - team-members - 成員管理
  - team-repositories - 倉庫列表

- **Components**:
  - team-member-list - 成員列表
  - team-header - 團隊標題

- **State**:
  - team.store - 團隊狀態
  - team-members.store - 成員狀態

### repository/
**倉庫管理功能**

- **Pages**:
  - repository-list - 倉庫列表
  - repository-detail - 倉庫詳情
  - repository-settings - 倉庫設定
  - repository-collaborators - 協作者管理

- **Components**:
  - repository-card - 倉庫卡片
  - repository-header - 倉庫標題
  - collaborator-list - 協作者列表

- **State**:
  - repository.store - 倉庫狀態
  - collaborators.store - 協作者狀態

## 元件設計原則

### Smart Components (Pages)
```typescript
@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  standalone: true
})
export class AccountProfileComponent {
  constructor(
    private accountService: AccountApplicationService,
    private accountStore: CurrentAccountStore
  ) {}

  // 處理業務邏輯
  // 管理狀態
  // 呼叫 Application Service
}
```

### Dumb Components (Components)
```typescript
@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  standalone: true
})
export class AccountCardComponent {
  @Input() account!: AccountDto;
  @Output() accountSelected = new EventEmitter<string>();

  // 只處理展示邏輯
  // 透過 Input/Output 與父元件溝通
}
```

## 狀態管理策略

- **Local State**: 元件內部使用 signals 或 RxJS
- **Feature State**: Store 管理 feature 範圍的狀態
- **Global State**: 透過 Core 層的服務共享

## 路由結構

```typescript
// account.routes.ts
export const ACCOUNT_ROUTES: Routes = [
  { path: 'profile', component: AccountProfileComponent },
  { path: 'settings', component: AccountSettingsComponent },
  { path: 'switch', component: AccountSwitcherComponent }
];
```

## 與其他層的關係

- **使用 Application 層**: 注入 Application Service 執行用例
- **顯示 DTO**: 使用 Application 層定義的 DTO
- **不依賴 Domain**: 不直接使用領域物件
- **不依賴 Infrastructure**: 透過 Application 層間接使用

## 測試策略

- **Pages**: 整合測試，使用 mock Application Service
- **Components**: 單元測試，測試 Input/Output
- **State**: 單元測試，測試狀態轉換邏輯
