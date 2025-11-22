import { Injectable } from '@angular/core';

/**
 * Supabase Realtime Service
 *
 * 提供 Supabase Realtime 相關操作，包含即時訂閱、廣播等功能。
 *
 * **注意：** 此服務目前為預留骨架，待未來實作即時功能時擴充。
 * **請勿在生產環境中使用此服務。**
 *
 * @example
 * ```typescript
 * const realtimeService = inject(SupabaseRealtimeService);
 *
 * // 未來實作範例
 * // const subscription = realtimeService.subscribe('table', callback);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseRealtimeService {
  constructor() {
    // 預留：未來實作 Realtime 相關初始化
    // 需要時注入 SupabaseClientService
  }

  // TODO: 實作即時通訊相關方法
  // - subscribe(table, callback)
  // - unsubscribe(subscription)
  // - broadcast(channel, event, payload)
  // - presence(channel)
  // - onPresenceSync(callback)
  // - onPresenceJoin(callback)
  // - onPresenceLeave(callback)
}
