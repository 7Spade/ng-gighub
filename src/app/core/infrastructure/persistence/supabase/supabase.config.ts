export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Gets environment variable value.
 * In browser context, this checks if the variable is available via build-time injection.
 * In server context (Node.js), this reads from process.env.
 * 
 * Note: For Angular applications, environment variables typically need to be:
 * - Injected at build time (using Angular's file replacement in angular.json)
 * - Or configured through Angular environment files (src/environments/)
 * - Or passed via custom build scripts
 * 
 * The NEXT_PUBLIC_ prefix is maintained for compatibility with external tools,
 * but Angular doesn't automatically expose these to the browser.
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  // Check if we're in a Node.js environment (server-side)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // For browser builds in Angular, environment variables need to be:
  // 1. Injected via Angular environment files (src/environments/)
  // 2. Or configured through angular.json file replacements
  // 3. Or passed via custom build scripts
  // 
  // Unlike Next.js, Angular doesn't automatically expose NEXT_PUBLIC_ variables.
  // For now, we return the default value in browser context and rely on
  // the fallback configuration below.
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
