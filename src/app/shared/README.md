# Shared 模組

## 概述

Shared 模組包含在多個 feature 之間共用的元件、directives、pipes 和工具函數。這些都是可重複使用的 UI 元件和輔助工具。

## 設計原則

- **可重複使用**: 所有元件都應該是通用的，不依賴特定業務邏輯
- **Standalone**: 優先使用 Standalone Components
- **輕量化**: 保持元件簡單，避免過度封裝
- **文檔完整**: 每個元件都應有清楚的使用說明

## 資料夾結構

### components/
**共用 UI 元件**

- **loading/** - 載入中元件
  - 顯示 spinner 或 skeleton
  - 統一的載入視覺效果

- **error/** - 錯誤訊息元件
  - 顯示錯誤訊息
  - 支援不同嚴重程度（error, warning, info）

- **empty-state/** - 空狀態元件
  - 當列表或資料為空時顯示
  - 可自訂訊息和圖示

### directives/
**共用指令**

- **permission/** - 權限指令
  - 根據使用者權限控制元素顯示
  - 用法: `<button *appPermission="'write'">Edit</button>`

- **role/** - 角色指令
  - 根據使用者角色控制元素顯示
  - 用法: `<div *appRole="'admin'">Admin Panel</div>`

### pipes/
**共用管道**

- **date-format/** - 日期格式化
  - 統一的日期顯示格式
  - 支援相對時間（如「2 小時前」）

- **truncate/** - 文字截斷
  - 限制文字長度
  - 自動加上省略號

### utils/
**工具函數**

- **validators/** - 自訂驗證器
  - 表單驗證邏輯
  - 如：email, username, password strength

- **formatters/** - 格式化函數
  - 資料格式化工具
  - 如：數字、貨幣、日期

## 使用範例

### Loading Component
```typescript
<app-loading *ngIf="isLoading"></app-loading>
```

### Error Component
```typescript
<app-error 
  *ngIf="error" 
  [message]="error">
</app-error>
```

### Permission Directive
```typescript
<button *appPermission="'repository:write'">
  Delete Repository
</button>
```

### Truncate Pipe
```typescript
{{ longText | truncate:50 }}
```

## Shared Module

所有共用元件、directives、pipes 應該在 `SharedModule` 中集中匯出：

```typescript
@NgModule({
  imports: [CommonModule],
  declarations: [
    LoadingComponent,
    ErrorComponent,
    // ...
  ],
  exports: [
    LoadingComponent,
    ErrorComponent,
    // ...
  ]
})
export class SharedModule { }
```

## 開發指南

### 新增共用元件
1. 確認該元件真的需要跨 feature 使用
2. 設計通用的 API（Input/Output）
3. 提供使用範例和文檔
4. 加入到 SharedModule

### 命名規範
- 元件: `[name].component.ts`
- Directive: `[name].directive.ts`
- Pipe: `[name].pipe.ts`
- Utils: `[name].ts`

### 測試要求
所有 shared 元件都必須有單元測試，因為它們會被多個地方使用。

## 與其他層的關係

- **被 Features 使用**: Feature modules 匯入 SharedModule
- **不依賴 Feature**: Shared 不應該依賴任何特定 feature
- **不依賴 Core**: 保持純粹的 UI 邏輯，不使用 Application/Domain 層
