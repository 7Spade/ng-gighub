import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '../supabase.client';

/**
 * Supabase Storage Service
 * 
 * 提供 Supabase Storage 相關操作，包含檔案上傳、下載、刪除等功能。
 * 
 * **重要：** 此服務依賴 SupabaseClientService。
 * 在 SSR 環境下，所有操作將返回錯誤。
 * 
 * @example
 * ```typescript
 * const storageService = inject(SupabaseStorageService);
 * 
 * // 上傳檔案
 * const file = new File(['content'], 'example.txt');
 * const result = await storageService.uploadFile('bucket-name', 'path/file.txt', file);
 * 
 * // 取得公開 URL
 * const { data } = storageService.getPublicUrl('bucket-name', 'path/file.txt');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {
  private clientService = inject(SupabaseClientService);

  /**
   * 上傳檔案到 Supabase Storage
   * 
   * @param bucket - Storage bucket 名稱
   * @param path - 檔案在 bucket 中的路徑
   * @param file - 要上傳的檔案
   * @param options - 上傳選項 (upsert, contentType 等)
   * @returns 上傳結果，包含路徑或錯誤
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    options?: { upsert?: boolean; contentType?: string }
  ) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await client.storage.from(bucket).upload(path, file, options);
  }

  /**
   * 從 Supabase Storage 下載檔案
   * 
   * @param bucket - Storage bucket 名稱
   * @param path - 檔案在 bucket 中的路徑
   * @returns 下載結果，包含資料或錯誤
   */
  async downloadFile(bucket: string, path: string) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await client.storage.from(bucket).download(path);
  }

  /**
   * 取得檔案的公開 URL
   * 
   * @param bucket - Storage bucket 名稱
   * @param path - 檔案在 bucket 中的路徑
   * @returns 公開 URL 物件
   */
  getPublicUrl(bucket: string, path: string) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: { publicUrl: '' } };
    }

    return client.storage.from(bucket).getPublicUrl(path);
  }

  /**
   * 為私有檔案建立簽署 URL
   * 
   * @param bucket - Storage bucket 名稱
   * @param path - 檔案在 bucket 中的路徑
   * @param expiresIn - 過期時間（秒），預設 3600 (1 小時)
   * @returns 簽署 URL，包含過期時間
   */
  async createSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await client.storage.from(bucket).createSignedUrl(path, expiresIn);
  }

  /**
   * 列出 storage bucket 中的檔案
   * 
   * @param bucket - Storage bucket 名稱
   * @param path - 資料夾路徑（選填）
   * @param options - 列表選項 (limit, offset, sortBy 等)
   * @returns 檔案清單
   */
  async listFiles(
    bucket: string,
    path?: string,
    options?: { limit?: number; offset?: number; sortBy?: { column: string; order: string } }
  ) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await client.storage.from(bucket).list(path, options);
  }

  /**
   * 從 Supabase Storage 刪除檔案
   * 
   * @param bucket - Storage bucket 名稱
   * @param paths - 要刪除的檔案路徑（單一或多個）
   * @returns 刪除結果
   */
  async deleteFile(bucket: string, paths: string | string[]) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    const pathsArray = Array.isArray(paths) ? paths : [paths];
    return await client.storage.from(bucket).remove(pathsArray);
  }

  /**
   * 移動或重新命名檔案
   * 
   * @param bucket - Storage bucket 名稱
   * @param fromPath - 目前檔案路徑
   * @param toPath - 新檔案路徑
   * @returns 移動結果
   */
  async moveFile(bucket: string, fromPath: string, toPath: string) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await client.storage.from(bucket).move(fromPath, toPath);
  }

  /**
   * 複製檔案
   * 
   * @param bucket - Storage bucket 名稱
   * @param fromPath - 來源檔案路徑
   * @param toPath - 目標檔案路徑
   * @returns 複製結果
   */
  async copyFile(bucket: string, fromPath: string, toPath: string) {
    const client = this.clientService.getClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await client.storage.from(bucket).copy(fromPath, toPath);
  }
}
