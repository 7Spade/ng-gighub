/**
 * Supabase Infrastructure - Public API
 * 
 * 此檔案匯出所有 Supabase 相關的 services、config 和 client，
 * 方便其他模組統一引用。
 */

// Configuration
export { SUPABASE_CONFIG } from './supabase.config';
export type { SupabaseConfig } from './supabase.config';

// Client
export { SupabaseClientService } from './supabase.client';

// Services
export { SupabaseStorageService } from './services/storage.service';
// Note: Auth and Realtime services are placeholder stubs - do not use yet
export { SupabaseAuthService } from './services/auth.service';
export { SupabaseRealtimeService } from './services/realtime.service';

// Note: Schemas, Mappers, and Repositories are placeholder stubs.
// They will be properly implemented and exported when needed.
// For now, they can be imported directly from their respective directories:
// - import { AccountSchema } from './schemas/account.schema';
// - import { AccountMapper } from './mappers/account.mapper';
// - import { AccountRepository } from './repositories/account.repository';
