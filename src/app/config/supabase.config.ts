export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Gets environment variable value.
 * In browser context, this checks if the variable is available via build-time injection.
 * In server context (Node.js), this reads from process.env.
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  // Check if we're in a Node.js environment (server-side)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // For browser builds, environment variables need to be injected at build time
  // or made available through import.meta.env (Vite) or similar mechanisms
  // For now, return the default value in browser context
  return defaultValue;
}

/**
 * Supabase configuration for the project.
 * 
 * **Configuration Priority:**
 * 1. Environment variables (from .env file or system environment)
 * 2. Fallback to hardcoded defaults
 * 
 * **Environment Variables:**
 * - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 * 
 * **IMPORTANT:** 
 * - The anon key is safe to use in client-side code as it has Row Level Security (RLS) restrictions.
 * - Get your keys from: Supabase Dashboard > Settings > API
 * - For production, always use environment variables instead of hardcoded values.
 * - Create a .env file based on .env.example and add your actual keys.
 * 
 * **Note:** The fallback URL below is from the MCP configuration.
 */
export const SUPABASE_CONFIG: SupabaseConfig = {
  url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 
       getEnvVar('SUPABASE_URL') || 
       'https://pfxxjtvnqptdvjfakotc.supabase.co',
  anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
           'YOUR_SUPABASE_ANON_KEY' // Replace with your actual anon key or set in .env
};
