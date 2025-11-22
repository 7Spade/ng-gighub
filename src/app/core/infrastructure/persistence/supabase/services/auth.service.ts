import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '../supabase.client';

/**
 * Supabase Auth Service
 * 
 * 提供 Supabase Auth 相關操作，包含使用者認證、登入、登出等功能。
 * 
 * **注意：** 此服務目前為預留骨架，待未來實作認證功能時擴充。
 * 
 * @example
 * ```typescript
 * const authService = inject(SupabaseAuthService);
 * 
 * // 未來實作範例
 * // const { data, error } = await authService.signIn(email, password);
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  private clientService = inject(SupabaseClientService);

  constructor() {
    // 預留：未來實作 Auth 相關初始化
  }

  // TODO: 實作認證相關方法
  // - signUp(email, password)
  // - signIn(email, password)
  // - signOut()
  // - getCurrentUser()
  // - onAuthStateChange(callback)
  // - resetPassword(email)
  // - updateUser(updates)
}
