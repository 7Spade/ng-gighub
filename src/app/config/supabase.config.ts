export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // Replace with your actual anon key from Supabase dashboard
};
