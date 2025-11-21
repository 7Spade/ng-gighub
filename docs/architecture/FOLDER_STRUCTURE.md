# 完整資料夾結構

本文件列出 ng-gighub 專案的完整資料夾結構，基於 DDD + Clean Architecture 設計。

## 專案根目錄

```
ng-gighub/
├── .github/                    # GitHub 配置
│   ├── agents/                 # Copilot 代理配置
│   └── workflows/              # CI/CD workflows
├── .vscode/                    # VS Code 配置
├── docs/                       # 專案文件
├── public/                     # 靜態資源
├── src/                        # 原始碼
├── angular.json                # Angular 專案配置
├── package.json                # NPM 依賴與腳本
├── tsconfig.json               # TypeScript 配置
├── README.md                   # 專案說明
├── ENV_SETUP.md                # 環境設定指南
└── SUPABASE_SETUP.md           # Supabase 設定指南
```

## src/ 目錄結構

```
src/
├── app/
│   ├── core/                           # 核心層（Domain + Application + Infrastructure）
│   │   ├── domain/                     # 領域層
│   │   ├── application/                # 應用層
│   │   └── infrastructure/             # 基礎設施層
│   ├── features/                       # 功能模塊（展示層）
│   ├── shared/                         # 共享模塊
│   ├── layouts/                        # 佈局組件
│   ├── app.config.ts                   # 應用配置
│   ├── app.config.server.ts            # SSR 配置
│   ├── app.routes.ts                   # 路由配置
│   └── app.ts                          # 應用根組件
├── assets/                             # 靜態資源
├── environments/                       # 環境配置
│   ├── environment.ts                  # 開發環境
│   └── environment.prod.ts             # 生產環境
├── index.html                          # HTML 入口
├── main.ts                             # 應用入口
├── main.server.ts                      # SSR 入口
├── server.ts                           # Express 伺服器
└── styles.scss                         # 全域樣式
```

## Domain Layer（領域層）

```
src/app/core/domain/
│
├── account/                            # Account 聚合根
│   ├── aggregates/
│   │   ├── account.aggregate.ts                # 抽象 Account 聚合根
│   │   ├── user-account.aggregate.ts           # User 帳戶聚合
│   │   ├── organization-account.aggregate.ts   # Organization 帳戶聚合
│   │   └── bot-account.aggregate.ts            # Bot 帳戶聚合
│   ├── entities/
│   │   ├── account-profile.entity.ts           # 帳戶個人檔案實體
│   │   └── account-settings.entity.ts          # 帳戶設定實體
│   ├── value-objects/
│   │   ├── account-id.vo.ts                    # 帳戶 ID
│   │   ├── account-type.vo.ts                  # 帳戶類型 (User/Org/Bot)
│   │   ├── account-name.vo.ts                  # 帳戶名稱
│   │   ├── username.vo.ts                      # 使用者名稱
│   │   ├── email.vo.ts                         # 電子郵件
│   │   └── account-role.vo.ts                  # 帳戶角色
│   ├── events/
│   │   ├── account-created.event.ts            # 帳戶建立事件
│   │   ├── account-switched.event.ts           # 帳戶切換事件
│   │   ├── account-updated.event.ts            # 帳戶更新事件
│   │   └── account-deleted.event.ts            # 帳戶刪除事件
│   ├── repositories/
│   │   └── account.repository.interface.ts     # Account 倉儲接口
│   ├── services/
│   │   ├── account-domain.service.ts           # Account 領域服務
│   │   ├── account-factory.service.ts          # Account 工廠服務
│   │   └── account-validator.service.ts        # Account 驗證服務
│   ├── specifications/
│   │   ├── can-switch-account.spec.ts          # 是否可切換帳戶規格
│   │   └── can-delete-account.spec.ts          # 是否可刪除帳戶規格
│   └── README.md                               # Account 聚合說明
│
├── organization/                       # Organization 聚合根
│   ├── aggregates/
│   │   └── organization.aggregate.ts           # Organization 聚合根
│   ├── entities/
│   │   ├── organization-member.entity.ts       # 組織成員實體
│   │   └── organization-invitation.entity.ts   # 組織邀請實體
│   ├── value-objects/
│   │   ├── organization-id.vo.ts               # 組織 ID
│   │   ├── member-role.vo.ts                   # 成員角色
│   │   └── organization-plan.vo.ts             # 組織方案
│   ├── events/
│   │   ├── organization-created.event.ts       # 組織建立事件
│   │   ├── member-added.event.ts               # 成員加入事件
│   │   ├── member-removed.event.ts             # 成員移除事件
│   │   └── team-created.event.ts               # 團隊建立事件
│   ├── repositories/
│   │   └── organization.repository.interface.ts
│   ├── services/
│   │   ├── organization-domain.service.ts
│   │   └── member-management.service.ts
│   └── README.md
│
├── team/                               # Team 聚合根
│   ├── aggregates/
│   │   └── team.aggregate.ts                   # Team 聚合根
│   ├── entities/
│   │   └── team-member.entity.ts               # 團隊成員實體
│   ├── value-objects/
│   │   ├── team-id.vo.ts                       # 團隊 ID
│   │   ├── team-name.vo.ts                     # 團隊名稱
│   │   └── team-role.vo.ts                     # 團隊角色
│   ├── events/
│   │   ├── team-created.event.ts               # 團隊建立事件
│   │   ├── member-joined.event.ts              # 成員加入事件
│   │   └── member-left.event.ts                # 成員離開事件
│   ├── repositories/
│   │   └── team.repository.interface.ts
│   ├── services/
│   │   └── team-domain.service.ts
│   └── README.md
│
├── repository/                         # Repository 聚合根
│   ├── aggregates/
│   │   └── repository.aggregate.ts             # Repository 聚合根
│   ├── entities/
│   │   ├── repository-permission.entity.ts     # 倉庫權限實體
│   │   └── repository-collaborator.entity.ts   # 倉庫協作者實體
│   ├── value-objects/
│   │   ├── repository-id.vo.ts                 # 倉庫 ID
│   │   ├── repository-name.vo.ts               # 倉庫名稱
│   │   ├── visibility.vo.ts                    # 可見性
│   │   └── permission-level.vo.ts              # 權限層級
│   ├── events/
│   │   ├── repository-created.event.ts         # 倉庫建立事件
│   │   ├── permission-granted.event.ts         # 權限授予事件
│   │   └── collaborator-added.event.ts         # 協作者加入事件
│   ├── repositories/
│   │   └── repository.repository.interface.ts
│   ├── services/
│   │   ├── repository-domain.service.ts
│   │   └── permission-management.service.ts
│   └── README.md
│
└── shared/                             # 共享領域
    ├── base/
    │   ├── aggregate-root.base.ts              # 聚合根基礎類別
    │   ├── entity.base.ts                      # 實體基礎類別
    │   ├── value-object.base.ts                # 值對象基礎類別
    │   └── domain-event.base.ts                # 領域事件基礎類別
    ├── types/
    │   ├── result.ts                           # Result<T, E> 類型
    │   ├── either.ts                           # Either<L, R> 類型
    │   └── unique-id.ts                        # UniqueId 類型
    ├── errors/
    │   ├── domain-error.ts                     # 領域錯誤
    │   └── validation-error.ts                 # 驗證錯誤
    └── README.md
```

## Application Layer（應用層）

```
src/app/core/application/
│
├── account/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── create-user-account.handler.ts      # 建立使用者帳戶
│   │   │   ├── create-organization.handler.ts      # 建立組織帳戶
│   │   │   ├── create-bot.handler.ts               # 建立機器人帳戶
│   │   │   ├── switch-account.handler.ts           # 切換帳戶
│   │   │   ├── update-account.handler.ts           # 更新帳戶
│   │   │   └── delete-account.handler.ts           # 刪除帳戶
│   │   ├── create-user-account.command.ts
│   │   ├── create-organization.command.ts
│   │   ├── create-bot.command.ts
│   │   ├── switch-account.command.ts
│   │   ├── update-account.command.ts
│   │   └── delete-account.command.ts
│   ├── queries/
│   │   ├── handlers/
│   │   │   ├── get-current-account.handler.ts      # 取得當前帳戶
│   │   │   ├── list-accessible-accounts.handler.ts # 列出可存取帳戶
│   │   │   ├── get-account-by-id.handler.ts        # 依 ID 取得帳戶
│   │   │   └── get-account-by-username.handler.ts  # 依使用者名稱取得
│   │   ├── get-current-account.query.ts
│   │   ├── list-accessible-accounts.query.ts
│   │   ├── get-account-by-id.query.ts
│   │   └── get-account-by-username.query.ts
│   ├── dto/
│   │   ├── account.dto.ts                          # 帳戶 DTO
│   │   ├── user-account.dto.ts                     # 使用者帳戶 DTO
│   │   ├── organization-account.dto.ts             # 組織帳戶 DTO
│   │   └── bot-account.dto.ts                      # 機器人帳戶 DTO
│   ├── services/
│   │   ├── account-application.service.ts          # 帳戶應用服務
│   │   └── account-switcher.service.ts             # 帳戶切換服務
│   └── README.md
│
├── organization/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── add-member.handler.ts               # 新增成員
│   │   │   ├── remove-member.handler.ts            # 移除成員
│   │   │   ├── update-member-role.handler.ts       # 更新成員角色
│   │   │   ├── create-team.handler.ts              # 建立團隊
│   │   │   └── create-bot.handler.ts               # 建立機器人
│   │   ├── add-member.command.ts
│   │   ├── remove-member.command.ts
│   │   ├── update-member-role.command.ts
│   │   ├── create-team.command.ts
│   │   └── create-bot.command.ts
│   ├── queries/
│   │   ├── handlers/
│   │   │   ├── list-members.handler.ts             # 列出成員
│   │   │   ├── list-teams.handler.ts               # 列出團隊
│   │   │   ├── list-bots.handler.ts                # 列出機器人
│   │   │   └── get-organization-stats.handler.ts   # 取得組織統計
│   │   ├── list-members.query.ts
│   │   ├── list-teams.query.ts
│   │   ├── list-bots.query.ts
│   │   └── get-organization-stats.query.ts
│   ├── dto/
│   │   ├── organization.dto.ts
│   │   ├── member.dto.ts
│   │   └── organization-stats.dto.ts
│   ├── services/
│   │   └── organization-application.service.ts
│   └── README.md
│
├── team/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── add-member.handler.ts               # 新增成員
│   │   │   ├── remove-member.handler.ts            # 移除成員
│   │   │   ├── update-team.handler.ts              # 更新團隊
│   │   │   └── delete-team.handler.ts              # 刪除團隊
│   │   ├── add-member.command.ts
│   │   ├── remove-member.command.ts
│   │   ├── update-team.command.ts
│   │   └── delete-team.command.ts
│   ├── queries/
│   │   ├── handlers/
│   │   │   ├── list-members.handler.ts             # 列出成員
│   │   │   ├── get-team-by-id.handler.ts           # 依 ID 取得團隊
│   │   │   └── list-team-repositories.handler.ts   # 列出團隊倉庫
│   │   ├── list-members.query.ts
│   │   ├── get-team-by-id.query.ts
│   │   └── list-team-repositories.query.ts
│   ├── dto/
│   │   ├── team.dto.ts
│   │   └── team-member.dto.ts
│   ├── services/
│   │   └── team-application.service.ts
│   └── README.md
│
├── repository/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── create-repository.handler.ts        # 建立倉庫
│   │   │   ├── update-repository.handler.ts        # 更新倉庫
│   │   │   ├── delete-repository.handler.ts        # 刪除倉庫
│   │   │   ├── grant-permission.handler.ts         # 授予權限
│   │   │   ├── revoke-permission.handler.ts        # 撤銷權限
│   │   │   └── add-collaborator.handler.ts         # 新增協作者
│   │   ├── create-repository.command.ts
│   │   ├── update-repository.command.ts
│   │   ├── delete-repository.command.ts
│   │   ├── grant-permission.command.ts
│   │   ├── revoke-permission.command.ts
│   │   └── add-collaborator.command.ts
│   ├── queries/
│   │   ├── handlers/
│   │   │   ├── list-repositories.handler.ts        # 列出倉庫
│   │   │   ├── get-repository-by-id.handler.ts     # 依 ID 取得倉庫
│   │   │   ├── list-collaborators.handler.ts       # 列出協作者
│   │   │   └── check-permission.handler.ts         # 檢查權限
│   │   ├── list-repositories.query.ts
│   │   ├── get-repository-by-id.query.ts
│   │   ├── list-collaborators.query.ts
│   │   └── check-permission.query.ts
│   ├── dto/
│   │   ├── repository.dto.ts
│   │   ├── collaborator.dto.ts
│   │   └── permission.dto.ts
│   ├── services/
│   │   └── repository-application.service.ts
│   └── README.md
│
└── shared/
    ├── interfaces/
    │   ├── command-handler.interface.ts            # Command Handler 接口
    │   └── query-handler.interface.ts              # Query Handler 接口
    ├── base/
    │   ├── base-command.ts                         # Command 基礎類別
    │   └── base-query.ts                           # Query 基礎類別
    └── README.md
```

## Infrastructure Layer（基礎設施層）

```
src/app/core/infrastructure/
│
├── persistence/
│   ├── supabase/
│   │   ├── repositories/
│   │   │   ├── account.repository.ts               # Account 倉儲實作
│   │   │   ├── organization.repository.ts          # Organization 倉儲實作
│   │   │   ├── team.repository.ts                  # Team 倉儲實作
│   │   │   └── repository.repository.ts            # Repository 倉儲實作
│   │   ├── mappers/
│   │   │   ├── account.mapper.ts                   # Account Mapper
│   │   │   ├── organization.mapper.ts              # Organization Mapper
│   │   │   ├── team.mapper.ts                      # Team Mapper
│   │   │   └── repository.mapper.ts                # Repository Mapper
│   │   ├── schemas/
│   │   │   ├── account.schema.ts                   # Account Schema 定義
│   │   │   ├── organization.schema.ts              # Organization Schema
│   │   │   ├── team.schema.ts                      # Team Schema
│   │   │   └── repository.schema.ts                # Repository Schema
│   │   ├── migrations/
│   │   │   ├── 001_initial-schema.sql              # 初始化 Schema
│   │   │   ├── 002_add-organizations.sql           # 新增組織表
│   │   │   ├── 003_add-teams.sql                   # 新增團隊表
│   │   │   └── 004_add-repositories.sql            # 新增倉庫表
│   │   └── README.md
│   └── query-services/
│       ├── account-query.service.ts                # Account 查詢服務
│       ├── organization-query.service.ts           # Organization 查詢
│       ├── team-query.service.ts                   # Team 查詢服務
│       └── repository-query.service.ts             # Repository 查詢
│
├── messaging/
│   ├── event-bus.service.ts                        # 事件總線
│   ├── event-publisher.service.ts                  # 事件發布者
│   ├── handlers/
│   │   ├── account-created.handler.ts              # 帳戶建立處理器
│   │   ├── account-switched.handler.ts             # 帳戶切換處理器
│   │   ├── member-added.handler.ts                 # 成員加入處理器
│   │   └── repository-created.handler.ts           # 倉庫建立處理器
│   └── README.md
│
├── auth/
│   ├── auth.service.ts                             # 認證服務
│   ├── jwt.service.ts                              # JWT 服務
│   ├── guards/
│   │   ├── auth.guard.ts                           # 認證守衛
│   │   └── role.guard.ts                           # 角色守衛
│   └── README.md
│
└── external/
    ├── email/
    │   ├── email.service.ts                        # Email 服務
    │   └── templates/                              # Email 模板
    │       ├── welcome.template.ts
    │       └── invitation.template.ts
    ├── storage/
    │   ├── file-storage.service.ts                 # 檔案儲存服務
    │   └── README.md
    └── README.md
```

## Features Layer（功能模塊/展示層）

```
src/app/features/
│
├── account/
│   ├── pages/
│   │   ├── account-profile/
│   │   │   ├── account-profile.component.ts
│   │   │   ├── account-profile.component.html
│   │   │   ├── account-profile.component.scss
│   │   │   └── account-profile.component.spec.ts
│   │   ├── account-settings/
│   │   │   ├── account-settings.component.ts
│   │   │   ├── account-settings.component.html
│   │   │   ├── account-settings.component.scss
│   │   │   └── account-settings.component.spec.ts
│   │   └── account-switcher/
│   │       ├── account-switcher.component.ts
│   │       ├── account-switcher.component.html
│   │       ├── account-switcher.component.scss
│   │       └── account-switcher.component.spec.ts
│   ├── components/
│   │   ├── account-card/
│   │   │   ├── account-card.component.ts
│   │   │   ├── account-card.component.html
│   │   │   ├── account-card.component.scss
│   │   │   └── account-card.component.spec.ts
│   │   ├── account-avatar/
│   │   │   ├── account-avatar.component.ts
│   │   │   ├── account-avatar.component.html
│   │   │   ├── account-avatar.component.scss
│   │   │   └── account-avatar.component.spec.ts
│   │   └── account-dropdown/
│   │       ├── account-dropdown.component.ts
│   │       ├── account-dropdown.component.html
│   │       ├── account-dropdown.component.scss
│   │       └── account-dropdown.component.spec.ts
│   ├── state/
│   │   ├── current-account.store.ts                # 當前帳戶狀態
│   │   ├── accessible-accounts.store.ts            # 可存取帳戶狀態
│   │   └── account-switcher.store.ts               # 帳戶切換狀態
│   ├── account.routes.ts                           # Account 路由
│   └── README.md
│
├── organization/
│   ├── pages/
│   │   ├── organization-dashboard/
│   │   │   ├── organization-dashboard.component.ts
│   │   │   ├── organization-dashboard.component.html
│   │   │   ├── organization-dashboard.component.scss
│   │   │   └── organization-dashboard.component.spec.ts
│   │   ├── organization-members/
│   │   │   ├── organization-members.component.ts
│   │   │   ├── organization-members.component.html
│   │   │   ├── organization-members.component.scss
│   │   │   └── organization-members.component.spec.ts
│   │   ├── organization-teams/
│   │   │   ├── organization-teams.component.ts
│   │   │   ├── organization-teams.component.html
│   │   │   ├── organization-teams.component.scss
│   │   │   └── organization-teams.component.spec.ts
│   │   ├── organization-bots/
│   │   │   ├── organization-bots.component.ts
│   │   │   ├── organization-bots.component.html
│   │   │   ├── organization-bots.component.scss
│   │   │   └── organization-bots.component.spec.ts
│   │   └── organization-settings/
│   │       ├── organization-settings.component.ts
│   │       ├── organization-settings.component.html
│   │       ├── organization-settings.component.scss
│   │       └── organization-settings.component.spec.ts
│   ├── components/
│   │   ├── member-list/
│   │   │   ├── member-list.component.ts
│   │   │   ├── member-list.component.html
│   │   │   ├── member-list.component.scss
│   │   │   └── member-list.component.spec.ts
│   │   ├── member-invite/
│   │   │   ├── member-invite.component.ts
│   │   │   ├── member-invite.component.html
│   │   │   ├── member-invite.component.scss
│   │   │   └── member-invite.component.spec.ts
│   │   ├── team-card/
│   │   │   ├── team-card.component.ts
│   │   │   ├── team-card.component.html
│   │   │   ├── team-card.component.scss
│   │   │   └── team-card.component.spec.ts
│   │   └── bot-card/
│   │       ├── bot-card.component.ts
│   │       ├── bot-card.component.html
│   │       ├── bot-card.component.scss
│   │       └── bot-card.component.spec.ts
│   ├── state/
│   │   ├── organization.store.ts                   # 組織狀態
│   │   ├── members.store.ts                        # 成員狀態
│   │   └── teams.store.ts                          # 團隊狀態
│   ├── organization.routes.ts                      # Organization 路由
│   └── README.md
│
├── team/
│   ├── pages/
│   │   ├── team-detail/
│   │   │   ├── team-detail.component.ts
│   │   │   ├── team-detail.component.html
│   │   │   ├── team-detail.component.scss
│   │   │   └── team-detail.component.spec.ts
│   │   ├── team-members/
│   │   │   ├── team-members.component.ts
│   │   │   ├── team-members.component.html
│   │   │   ├── team-members.component.scss
│   │   │   └── team-members.component.spec.ts
│   │   └── team-repositories/
│   │       ├── team-repositories.component.ts
│   │       ├── team-repositories.component.html
│   │       ├── team-repositories.component.scss
│   │       └── team-repositories.component.spec.ts
│   ├── components/
│   │   ├── team-member-list/
│   │   │   ├── team-member-list.component.ts
│   │   │   ├── team-member-list.component.html
│   │   │   ├── team-member-list.component.scss
│   │   │   └── team-member-list.component.spec.ts
│   │   └── team-header/
│   │       ├── team-header.component.ts
│   │       ├── team-header.component.html
│   │       ├── team-header.component.scss
│   │       └── team-header.component.spec.ts
│   ├── state/
│   │   ├── team.store.ts                           # 團隊狀態
│   │   └── team-members.store.ts                   # 團隊成員狀態
│   ├── team.routes.ts                              # Team 路由
│   └── README.md
│
└── repository/
    ├── pages/
    │   ├── repository-list/
    │   │   ├── repository-list.component.ts
    │   │   ├── repository-list.component.html
    │   │   ├── repository-list.component.scss
    │   │   └── repository-list.component.spec.ts
    │   ├── repository-detail/
    │   │   ├── repository-detail.component.ts
    │   │   ├── repository-detail.component.html
    │   │   ├── repository-detail.component.scss
    │   │   └── repository-detail.component.spec.ts
    │   ├── repository-settings/
    │   │   ├── repository-settings.component.ts
    │   │   ├── repository-settings.component.html
    │   │   ├── repository-settings.component.scss
    │   │   └── repository-settings.component.spec.ts
    │   └── repository-collaborators/
    │       ├── repository-collaborators.component.ts
    │       ├── repository-collaborators.component.html
    │       ├── repository-collaborators.component.scss
    │       └── repository-collaborators.component.spec.ts
    ├── components/
    │   ├── repository-card/
    │   │   ├── repository-card.component.ts
    │   │   ├── repository-card.component.html
    │   │   ├── repository-card.component.scss
    │   │   └── repository-card.component.spec.ts
    │   ├── repository-header/
    │   │   ├── repository-header.component.ts
    │   │   ├── repository-header.component.html
    │   │   ├── repository-header.component.scss
    │   │   └── repository-header.component.spec.ts
    │   └── collaborator-list/
    │       ├── collaborator-list.component.ts
    │       ├── collaborator-list.component.html
    │       ├── collaborator-list.component.scss
    │       └── collaborator-list.component.spec.ts
    ├── state/
    │   ├── repository.store.ts                     # 倉庫狀態
    │   └── collaborators.store.ts                  # 協作者狀態
    ├── repository.routes.ts                        # Repository 路由
    └── README.md
```

## Shared Module（共享模塊）

```
src/app/shared/
├── components/
│   ├── loading/
│   │   ├── loading.component.ts
│   │   ├── loading.component.html
│   │   ├── loading.component.scss
│   │   └── loading.component.spec.ts
│   ├── error/
│   │   ├── error.component.ts
│   │   ├── error.component.html
│   │   ├── error.component.scss
│   │   └── error.component.spec.ts
│   └── empty-state/
│       ├── empty-state.component.ts
│       ├── empty-state.component.html
│       ├── empty-state.component.scss
│       └── empty-state.component.spec.ts
├── directives/
│   ├── permission/
│   │   ├── permission.directive.ts
│   │   └── permission.directive.spec.ts
│   └── role/
│       ├── role.directive.ts
│       └── role.directive.spec.ts
├── pipes/
│   ├── date-format/
│   │   ├── date-format.pipe.ts
│   │   └── date-format.pipe.spec.ts
│   └── truncate/
│       ├── truncate.pipe.ts
│       └── truncate.pipe.spec.ts
├── utils/
│   ├── validators/
│   │   ├── custom-validators.ts
│   │   └── custom-validators.spec.ts
│   └── formatters/
│       ├── string-formatter.ts
│       └── date-formatter.ts
└── README.md
```

## Layouts（佈局）

```
src/app/layouts/
├── default/
│   ├── components/
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   ├── header.component.scss
│   │   │   └── header.component.spec.ts
│   │   ├── sidebar/
│   │   │   ├── sidebar.component.ts
│   │   │   ├── sidebar.component.html
│   │   │   ├── sidebar.component.scss
│   │   │   └── sidebar.component.spec.ts
│   │   └── footer/
│   │       ├── footer.component.ts
│   │       ├── footer.component.html
│   │       ├── footer.component.scss
│   │       └── footer.component.spec.ts
│   ├── default.component.ts
│   ├── default.component.html
│   ├── default.component.scss
│   └── default.component.spec.ts
└── auth/
    ├── auth.component.ts
    ├── auth.component.html
    ├── auth.component.scss
    └── auth.component.spec.ts
```

## 檔案命名規範

### TypeScript 檔案
- **Aggregates**: `*.aggregate.ts` (例：`account.aggregate.ts`)
- **Entities**: `*.entity.ts` (例：`account-profile.entity.ts`)
- **Value Objects**: `*.vo.ts` (例：`email.vo.ts`)
- **Events**: `*.event.ts` (例：`account-created.event.ts`)
- **Commands**: `*.command.ts` (例：`create-account.command.ts`)
- **Queries**: `*.query.ts` (例：`get-account.query.ts`)
- **Handlers**: `*.handler.ts` (例：`create-account.handler.ts`)
- **DTOs**: `*.dto.ts` (例：`account.dto.ts`)
- **Services**: `*.service.ts` (例：`account.service.ts`)
- **Repositories**: `*.repository.ts` (例：`account.repository.ts`)
- **Interfaces**: `*.interface.ts` (例：`repository.interface.ts`)
- **Mappers**: `*.mapper.ts` (例：`account.mapper.ts`)
- **Schemas**: `*.schema.ts` (例：`account.schema.ts`)
- **Specifications**: `*.spec.ts` (業務規格，例：`can-delete.spec.ts`)

### Angular 組件檔案
- **Component**: `*.component.ts`
- **Template**: `*.component.html`
- **Styles**: `*.component.scss`
- **Tests**: `*.component.spec.ts` (測試檔案)
- **Store**: `*.store.ts` (狀態管理)
- **Routes**: `*.routes.ts` (路由定義)

### 其他檔案
- **Base Classes**: `*.base.ts` (例：`aggregate-root.base.ts`)
- **Types**: `*.ts` (例：`result.ts`, `either.ts`)
- **Errors**: `*-error.ts` (例：`domain-error.ts`)
- **Guards**: `*.guard.ts` (例：`auth.guard.ts`)
- **Directives**: `*.directive.ts` (例：`permission.directive.ts`)
- **Pipes**: `*.pipe.ts` (例：`date-format.pipe.ts`)

## 資料夾命名規範

- 使用 **kebab-case**（小寫加連字號）
- 單數形式用於聚合根/領域概念（例：`account/`, `organization/`）
- 複數形式用於集合/列表（例：`aggregates/`, `entities/`, `commands/`）
- 功能描述明確（例：`value-objects/`, `domain-events/`, `query-services/`）

## 總計檔案數估算

基於完整結構，預估檔案數量：

- **Domain Layer**: ~200 個檔案
- **Application Layer**: ~150 個檔案
- **Infrastructure Layer**: ~80 個檔案
- **Features Layer**: ~160 個檔案
- **Shared/Layouts**: ~40 個檔案

**總計約 630+ 個檔案**

---

**備註**:
- 本文件列出完整的目標結構，實際實作將分階段進行
- 每個主要資料夾建議包含 `README.md` 說明其職責與使用方式
- 測試檔案（`*.spec.ts`）應與被測試檔案放在同一目錄
- 路由檔案（`*.routes.ts`）定義各功能模塊的路由配置
