import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase.config';

/**
 * Supabase service for database and storage operations.
 * 
 * **Important:** This service only initializes on the browser (client-side).
 * On the server during SSR, the client will be null.
 * Always check if the client is available before using it.
 * 
 * @example
 * ```typescript
 * const supabase = inject(SupabaseService);
 * 
 * // Database operations
 * const client = supabase.client;
 * if (client) {
 *   const { data } = await client.from('table').select('*');
 * }
 * 
 * // Storage operations
 * const file = new File(['content'], 'example.txt');
 * const result = await supabase.uploadFile('bucket-name', 'path/file.txt', file);
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

  // ============== Storage Operations ==============

  /**
   * Upload a file to Supabase Storage.
   * @param bucket - Storage bucket name
   * @param path - File path in the bucket
   * @param file - File to upload
   * @param options - Optional upload options (upsert, contentType, etc.)
   * @returns Upload result with path or error
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    options?: { upsert?: boolean; contentType?: string }
  ) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await this.supabase.storage.from(bucket).upload(path, file, options);
  }

  /**
   * Download a file from Supabase Storage.
   * @param bucket - Storage bucket name
   * @param path - File path in the bucket
   * @returns Download result with data or error
   */
  async downloadFile(bucket: string, path: string) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await this.supabase.storage.from(bucket).download(path);
  }

  /**
   * Get a public URL for a file in Supabase Storage.
   * @param bucket - Storage bucket name
   * @param path - File path in the bucket
   * @returns Public URL object
   */
  getPublicUrl(bucket: string, path: string) {
    if (!this.supabase) {
      return { data: { publicUrl: '' } };
    }

    return this.supabase.storage.from(bucket).getPublicUrl(path);
  }

  /**
   * Get a signed URL for private file access.
   * @param bucket - Storage bucket name
   * @param path - File path in the bucket
   * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
   * @returns Signed URL with expiration
   */
  async createSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  }

  /**
   * List files in a storage bucket.
   * @param bucket - Storage bucket name
   * @param path - Folder path (optional)
   * @param options - List options (limit, offset, sortBy, etc.)
   * @returns List of files
   */
  async listFiles(
    bucket: string,
    path?: string,
    options?: { limit?: number; offset?: number; sortBy?: { column: string; order: string } }
  ) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await this.supabase.storage.from(bucket).list(path, options);
  }

  /**
   * Delete a file from Supabase Storage.
   * @param bucket - Storage bucket name
   * @param paths - File path(s) to delete
   * @returns Delete result
   */
  async deleteFile(bucket: string, paths: string | string[]) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    const pathsArray = Array.isArray(paths) ? paths : [paths];
    return await this.supabase.storage.from(bucket).remove(pathsArray);
  }

  /**
   * Move or rename a file in Supabase Storage.
   * @param bucket - Storage bucket name
   * @param fromPath - Current file path
   * @param toPath - New file path
   * @returns Move result
   */
  async moveFile(bucket: string, fromPath: string, toPath: string) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await this.supabase.storage.from(bucket).move(fromPath, toPath);
  }

  /**
   * Copy a file within Supabase Storage.
   * @param bucket - Storage bucket name
   * @param fromPath - Source file path
   * @param toPath - Destination file path
   * @returns Copy result
   */
  async copyFile(bucket: string, fromPath: string, toPath: string) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not available (SSR context)') };
    }

    return await this.supabase.storage.from(bucket).copy(fromPath, toPath);
  }
}
