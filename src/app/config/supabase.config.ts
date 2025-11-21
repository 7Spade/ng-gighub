export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Supabase configuration for the project.
 * 
 * **IMPORTANT:** Replace 'YOUR_SUPABASE_ANON_KEY' with your actual anon key.
 * The anon key is safe to use in client-side code as it has Row Level Security (RLS) restrictions.
 * Get your keys from: Supabase Dashboard > Settings > API
 * 
 * Note: The project URL below is already public (from MCP configuration).
 */
export const SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // Replace with your actual anon key from Supabase dashboard
};
