import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase.config';

/**
 * Supabase Client Service (Singleton)
 * 
 * 提供單例的 Supabase client 實例，並處理 SSR 環境檢查。
 * 
 * **重要：** 此服務僅在瀏覽器環境初始化。
 * 在 SSR 期間，client 將為 null。
 * 使用前務必檢查 client 是否可用。
 * 
 * @example
 * ```typescript
 * const supabaseClient = inject(SupabaseClientService);
 * 
 * const client = supabaseClient.getClient();
 * if (client) {
 *   const { data } = await client.from('table').select('*');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // 僅在瀏覽器環境初始化 Supabase
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
      );
    }
  }

  /**
   * 取得 Supabase client 實例
   * 
   * @returns SupabaseClient 實例，在 SSR 環境下返回 null
   */
  getClient(): SupabaseClient | null {
    return this.supabase;
  }

  /**
   * 檢查 Supabase client 是否可用（是否在瀏覽器環境）
   * 
   * @returns true 表示 client 可用，false 表示在 SSR 環境
   */
  isClientAvailable(): boolean {
    return this.supabase !== null;
  }
}
