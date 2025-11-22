# Supabase Infrastructure

此目錄包含所有與 Supabase 相關的基礎設施程式碼，遵循 DDD（領域驅動設計）和關注點分離原則。

## 目錄結構

```
supabase/
├── supabase.client.ts      # Supabase 客戶端單例服務
├── supabase.config.ts      # Supabase 配置（URL、KEY 等）
├── index.ts                # 統一匯出入口
├── services/               # Supabase 功能服務（Storage、Auth、Realtime）
│   ├── storage.service.ts  # 檔案儲存服務
│   ├── auth.service.ts     # 認證服務（預留）
│   └── realtime.service.ts # 即時通訊服務（預留）
├── repositories/           # DDD Repository 實作
│   ├── account.repository.ts
│   ├── organization.repository.ts
│   ├── repository.repository.ts
│   └── team.repository.ts
├── mappers/                # 資料轉換器（Supabase Row ↔ Domain Entity）
│   ├── account.mapper.ts
│   ├── organization.mapper.ts
│   ├── repository.mapper.ts
│   └── team.mapper.ts
├── schemas/                # Supabase 資料表型別定義
│   ├── account.schema.ts
│   ├── organization.schema.ts
│   ├── repository.schema.ts
│   └── team.schema.ts
└── migrations/             # SQL 遷移檔案
    └── initial-schema.sql
```

## 核心檔案說明

### supabase.client.ts
提供單例的 Supabase client 實例，負責：
- 初始化 Supabase client
- 處理 SSR 環境檢查
- 確保整個應用程式使用同一個 client 實例

**使用範例：**
```typescript
import { SupabaseClientService } from '@app/core/infrastructure/persistence/supabase';

const clientService = inject(SupabaseClientService);
const client = clientService.getClient();

if (client) {
  const { data, error } = await client.from('table').select('*');
}
```

### supabase.config.ts
統一管理 Supabase 配置，包含：
- Supabase 專案 URL
- Anonymous Key
- 其他連線選項

配置優先順序：
1. 環境變數（`.env` 檔案）
2. 預設值（fallback）

### services/
包含超越基本 CRUD 的 Supabase 功能服務：

#### storage.service.ts
提供檔案儲存操作：
- `uploadFile()` - 上傳檔案
- `downloadFile()` - 下載檔案
- `deleteFile()` - 刪除檔案
- `moveFile()` - 移動/重新命名檔案
- `copyFile()` - 複製檔案
- `listFiles()` - 列出檔案
- `getPublicUrl()` - 取得公開 URL
- `createSignedUrl()` - 建立簽署 URL

**使用範例：**
```typescript
import { SupabaseStorageService } from '@app/core/infrastructure/persistence/supabase';

const storageService = inject(SupabaseStorageService);

// 上傳檔案
const file = new File(['content'], 'example.txt');
const result = await storageService.uploadFile('my-bucket', 'path/file.txt', file);

// 取得公開 URL
const { data } = storageService.getPublicUrl('my-bucket', 'path/file.txt');
```

#### auth.service.ts（預留）
未來將實作使用者認證功能：
- 註冊、登入、登出
- 取得當前使用者
- 密碼重設
- OAuth 整合

#### realtime.service.ts（預留）
未來將實作即時通訊功能：
- 資料表訂閱
- 廣播訊息
- Presence（線上狀態）

### repositories/
實作 Domain Repository 介面，負責：
- 資料持久化邏輯
- 使用 Supabase client 進行 CRUD 操作
- 透過 Mapper 轉換資料

### mappers/
負責資料轉換：
- Supabase Row → Domain Entity（從資料庫讀取）
- Domain Entity → Supabase Row（寫入資料庫）

### schemas/
TypeScript 型別定義，對應 Supabase 資料表結構，確保型別安全。

### migrations/
SQL 遷移檔案，用於版本控制資料庫結構變更。

## 使用指南

### 1. 基本資料庫操作

```typescript
import { SupabaseClientService } from '@app/core/infrastructure/persistence/supabase';

const clientService = inject(SupabaseClientService);
const client = clientService.getClient();

if (client) {
  // 查詢
  const { data, error } = await client
    .from('accounts')
    .select('*')
    .eq('username', 'example');

  // 新增
  const { data, error } = await client
    .from('accounts')
    .insert({ username: 'new-user', email: 'user@example.com' });

  // 更新
  const { data, error } = await client
    .from('accounts')
    .update({ email: 'new@example.com' })
    .eq('id', userId);

  // 刪除
  const { data, error } = await client
    .from('accounts')
    .delete()
    .eq('id', userId);
}
```

### 2. 使用 Storage Service

```typescript
import { SupabaseStorageService } from '@app/core/infrastructure/persistence/supabase';

const storageService = inject(SupabaseStorageService);

// 上傳使用者頭像
const avatarFile = new File([blob], 'avatar.png', { type: 'image/png' });
const { data, error } = await storageService.uploadFile(
  'avatars',
  `users/${userId}/avatar.png`,
  avatarFile,
  { upsert: true }
);

// 取得頭像 URL
const { data: urlData } = storageService.getPublicUrl('avatars', `users/${userId}/avatar.png`);
const avatarUrl = urlData.publicUrl;
```

### 3. SSR 考量

所有服務都會自動處理 SSR 環境：
- 在 SSR 期間，Supabase client 為 `null`
- 所有操作會返回適當的錯誤訊息
- 確保應用程式在 server 和 browser 環境都能正常運作

**檢查範例：**
```typescript
const clientService = inject(SupabaseClientService);

if (clientService.isClientAvailable()) {
  // 僅在瀏覽器環境執行
  const client = clientService.getClient();
  // ... 執行 Supabase 操作
}
```

## 最佳實務

1. **統一使用 SupabaseClientService**
   - 不要直接 `createClient()`，透過 `SupabaseClientService` 取得 client
   - 確保整個應用程式使用同一個 client 實例

2. **使用專用 Service**
   - Storage 操作：使用 `SupabaseStorageService`
   - 未來 Auth：使用 `SupabaseAuthService`
   - 未來 Realtime：使用 `SupabaseRealtimeService`

3. **Repository 模式**
   - Domain 層透過 Repository Interface 與資料層互動
   - Repository 實作放在此目錄
   - 使用 Mapper 確保資料轉換正確

4. **型別安全**
   - 使用 `schemas/` 定義的型別
   - 避免使用 `any` 型別
   - 善用 TypeScript 的型別推斷

5. **錯誤處理**
   - 總是檢查 `error` 回傳值
   - 在 SSR 環境下提供適當的 fallback
   - 記錄錯誤以便除錯

## 遷移指南

如果您之前使用舊的 `SupabaseService`，請更新引用：

**舊寫法：**
```typescript
import { SupabaseService } from '@app/services/supabase.service';

const supabase = inject(SupabaseService);
const client = supabase.client;
await supabase.uploadFile(...);
```

**新寫法：**
```typescript
import { 
  SupabaseClientService,
  SupabaseStorageService 
} from '@app/core/infrastructure/persistence/supabase';

// 資料庫操作
const clientService = inject(SupabaseClientService);
const client = clientService.getClient();

// Storage 操作
const storageService = inject(SupabaseStorageService);
await storageService.uploadFile(...);
```

## 相關文件

- [Supabase 官方文件](https://supabase.com/docs)
- [Angular SSR 指南](https://angular.dev/guide/ssr)
- [專案 Supabase 設定](../../../../SUPABASE_SETUP.md)
