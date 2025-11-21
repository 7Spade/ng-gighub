import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase.config';

/**
 * Supabase service for database operations.
 * 
 * **Important:** This service only initializes on the browser (client-side).
 * On the server during SSR, the client will be null.
 * Always check if the client is available before using it.
 * 
 * @example
 * ```typescript
 * const supabase = inject(SupabaseService);
 * const client = supabase.client;
 * if (client) {
 *   // Safe to use client here
 *   const { data } = await client.from('table').select('*');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Only initialize Supabase in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
      );
    }
  }

  /**
   * Gets the Supabase client instance.
   * Returns null when running on the server (during SSR).
   * Always check for null before using.
   */
  get client(): SupabaseClient | null {
    return this.supabase;
  }

  /**
   * Checks if the Supabase client is available (running in browser).
   * Use this for explicit client availability checks.
   */
  isClientAvailable(): boolean {
    return this.supabase !== null;
  }
}
