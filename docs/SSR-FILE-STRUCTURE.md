# Angular SSR 檔案結構分析

> **📌 注意**: 這是一份歷史分析文件，記錄了 2025-11-21 專案 SSR 精簡化過程的決策。  
> **狀態**: 已完成並應用到專案  
> **類型**: 歷史參考，不建議作為當前開發指引

## 專案背景
本專案使用 Angular 20.1 + Server-Side Rendering (SSR)，目標是達到最精簡的 SSR 設定。

## 檔案分析結果

### 可以刪除的檔案 (2 個)

#### 1. `src/app/app.routes.server.ts` ❌ 已刪除
**原因:**
- 此檔案用於定義伺服器端路由的渲染模式（如 Prerender、Server、Client）
- 使用 `RenderMode.Prerender` 會觸發 Angular 的 route extraction 機制
- 導致建置錯誤 NG0401: "An error occurred while extracting routes"
- 對於純 SSR 應用（不需要 prerendering 或混合渲染策略），此檔案非必要
- 預設 SSR 行為已足夠，不需要額外配置

**原始內容:**
```typescript
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
```

#### 2. `src/app/app.html` ❌ 已刪除
**原因:**
- 模板內容僅 2 行，非常簡單
- 可直接內嵌到元件的 `template` 屬性中
- 減少檔案數量，提升專案整潔度

**原始內容:**
```html
<h1>{{ title() }}</h1>
<router-outlet />
```

**替代方案:**
已內嵌到 `src/app/app.ts`:
```typescript
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>{{ title() }}</h1>
    <router-outlet />
  `
})
```

---

### 必須保留的檔案 (9 個)

#### 1. `src/app/app.config.server.ts` ✅ 必要
**功能:** 伺服器端應用程式配置
**必要性:** SSR 必需，提供 `provideServerRendering()` 等伺服器端 providers
**依賴:** 被 `src/main.server.ts` 匯入

#### 2. `src/app/app.config.ts` ✅ 必要  
**功能:** 瀏覽器端應用程式配置
**必要性:** 提供 hydration、routing 等核心功能
**依賴:** 被 `src/main.ts` 和 `src/app/app.config.server.ts` 匯入

#### 3. `src/app/app.routes.ts` ✅ 必要
**功能:** 應用程式路由定義
**必要性:** 即使目前是空陣列，routing 系統仍需要此檔案
**依賴:** 被 `src/app/app.config.ts` 匯入

#### 4. `src/app/app.ts` ✅ 必要
**功能:** 根元件
**必要性:** 應用程式的進入點元件
**依賴:** 被 `src/main.ts` 和 `src/main.server.ts` 匯入以啟動應用

#### 5. `src/index.html` ✅ 必要
**功能:** HTML 外殼
**必要性:** SSR 需要此 HTML 模板作為渲染基礎
**依賴:** Angular 建置系統的必要檔案，在 `angular.json` 中未明確指定但為標準結構

#### 6. `src/main.server.ts` ✅ 必要
**功能:** 伺服器端啟動入口
**必要性:** SSR 的 bootstrap 程式碼
**依賴:** 在 `angular.json` 中指定為 `"server": "src/main.server.ts"`

#### 7. `src/main.ts` ✅ 必要
**功能:** 瀏覽器端啟動入口  
**必要性:** 客戶端 hydration 和瀏覽器執行的 bootstrap 程式碼
**依賴:** 在 `angular.json` 中指定為 `"browser": "src/main.ts"`

#### 8. `src/server.ts` ✅ 必要
**功能:** Express 伺服器配置
**必要性:** SSR 執行時期的 HTTP 伺服器
**依賴:** 在 `angular.json` 中指定為 `"ssr.entry": "src/server.ts"`

#### 9. `src/styles.scss` ✅ 必要
**功能:** 全域樣式
**必要性:** 即使目前為空，建置系統仍引用此檔案
**依賴:** 在 `angular.json` 中指定於 `"styles": ["src/styles.scss"]`

---

## 建置配置變更

### `angular.json` 修改

**移除:**
```json
"outputMode": "server"
```

**原因:**
- `outputMode: "server"` 會強制執行 route extraction
- 即使移除 `app.routes.server.ts`，只要有此設定就會嘗試提取路由
- 移除後建置系統仍會正確生成 SSR bundles，但不會執行 prerendering

---

## 建置結果

執行 `npm run build` 成功輸出:

```
✔ Building...
Browser bundles     
Initial chunk files  | Names            |  Raw size | Estimated transfer size
main-W26H6IYL.js     | main             | 221.97 kB |                61.34 kB
styles-5INURTSO.css  | styles           |   0 bytes |                 0 bytes

Server bundles      
Initial chunk files  | Names            |  Raw size
server.mjs           | server           |   1.30 MB |                        
chunk-74SJGHDD.mjs   | -                | 669.87 kB |                        
polyfills.server.mjs | polyfills.server | 233.48 kB |                        
main.server.mjs      | main.server      | 854 bytes |                        

Application bundle generation complete.
```

### 建置狀態
- ✅ 無 TypeScript 編譯錯誤
- ✅ Browser bundles 正常生成
- ✅ Server bundles 正常生成
- ✅ 解決原本的 NG0401 route extraction 錯誤

---

## 總結

### 精簡前 (11 個檔案)
```
src/
├── app/
│   ├── app.config.server.ts
│   ├── app.config.ts
│   ├── app.html               ← 已刪除
│   ├── app.routes.server.ts   ← 已刪除
│   ├── app.routes.ts
│   └── app.ts
├── index.html
├── main.server.ts
├── main.ts
├── server.ts
└── styles.scss
```

### 精簡後 (9 個檔案)
```
src/
├── app/
│   ├── app.config.server.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── index.html
├── main.server.ts
├── main.ts
├── server.ts
└── styles.scss
```

### 檔案減少
- **移除檔案:** 2 個 (18% 減少)
- **保留檔案:** 9 個 (100% SSR 必要)
- **建置狀態:** ✅ 成功
- **功能完整性:** ✅ 保持

這是 Angular 20.1 SSR 的最精簡配置，所有保留的檔案都是 SSR 功能運作所必需的。
