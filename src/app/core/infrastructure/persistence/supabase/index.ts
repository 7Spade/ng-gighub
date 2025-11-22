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
export { SupabaseAuthService } from './services/auth.service';
export { SupabaseRealtimeService } from './services/realtime.service';

// Schemas
export * from './schemas/account.schema';
export * from './schemas/organization.schema';
export * from './schemas/repository.schema';
export * from './schemas/team.schema';

// Mappers
export * from './mappers/account.mapper';
export * from './mappers/organization.mapper';
export * from './mappers/repository.mapper';
export * from './mappers/team.mapper';

// Repositories
export * from './repositories/account.repository';
export * from './repositories/organization.repository';
export * from './repositories/repository.repository';
export * from './repositories/team.repository';
