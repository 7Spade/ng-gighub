# Environment Variables Setup Guide

This guide explains how to configure environment variables for the ng-gighub Angular project.

## Important Note About Variable Naming

This project uses `NEXT_PUBLIC_` prefixed environment variables for compatibility with external tools and services. However, **ng-gighub is an Angular application, not Next.js**. 

Key points:
- **Server-side (SSR)**: Environment variables work as expected via `process.env` when loaded with dotenv
- **Client-side**: Angular doesn't automatically expose `NEXT_PUBLIC_` variables to the browser
- For production client-side usage, consider configuring Angular environment files (`src/environments/`) or using build-time replacements
- The current implementation uses server-side environment variables with client-side fallback to hardcoded defaults

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   - Get your Supabase credentials from [Supabase Dashboard](https://app.supabase.com/project/_/settings/api)
   - Update the PostgreSQL connection strings if you're using direct database connections

3. **Start the development server:**
   ```bash
   npm start
   ```

## Environment Variables Reference

### Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL`
- **Description:** Your Supabase project URL
- **Example:** `https://your-project.supabase.co`
- **Required:** Yes
- **Safe for client-side:** Yes
- **Note:** The NEXT_PUBLIC_ prefix is for compatibility with external tools. In Angular, this works server-side via process.env. For client-side, configure via Angular environment files.

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description:** Your Supabase anonymous/public key
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Required:** Yes
- **Safe for client-side:** Yes (with Row Level Security enabled)
- **Note:** The NEXT_PUBLIC_ prefix is for compatibility with external tools. In Angular, this works server-side via process.env. For client-side, configure via Angular environment files.

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Description:** Service role key with full database access
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Required:** No (only for server-side operations requiring elevated privileges)
- **Safe for client-side:** ⚠️ **NO** - Keep this secret! Server-side only.

#### `SUPABASE_JWT_SECRET`
- **Description:** JWT secret for token verification
- **Example:** `your-jwt-secret-here`
- **Required:** No (only if manually verifying JWT tokens)
- **Safe for client-side:** ⚠️ **NO** - Keep this secret! Server-side only.

### PostgreSQL Configuration

These variables are typically provided by Supabase or your database hosting provider. They're used for direct database connections, migrations, and when using ORMs like Prisma.

#### `POSTGRES_URL`
- **Description:** Pooled database connection string
- **Example:** `postgresql://user:password@host:5432/database`
- **Required:** No (unless using direct database connections)
- **Use case:** General application queries with connection pooling

#### `POSTGRES_URL_NON_POOLING`
- **Description:** Direct database connection (non-pooled)
- **Example:** `postgresql://user:password@host:5432/database`
- **Required:** No
- **Use case:** Database migrations, schema changes

#### `POSTGRES_PRISMA_URL`
- **Description:** Prisma-optimized connection string
- **Example:** `postgresql://user:password@host:5432/database?pgbouncer=true`
- **Required:** No (only if using Prisma ORM)
- **Use case:** Prisma database operations

#### Individual PostgreSQL Parameters

- `POSTGRES_HOST`: Database host (e.g., `your-db.supabase.co`)
- `POSTGRES_DATABASE`: Database name (default: `postgres`)
- `POSTGRES_USER`: Database user (default: `postgres`)
- `POSTGRES_PASSWORD`: Database password

**Note:** These are typically used when constructing connection strings programmatically or for specific tools that require individual parameters.

## Security Best Practices

### ✅ DO:
- Keep your `.env` file in `.gitignore` (already configured)
- Use different credentials for development and production
- Rotate keys regularly, especially if they might be compromised
- Use the NEXT_PUBLIC_ prefix only for truly public, client-safe values
- Enable Row Level Security (RLS) in Supabase for all tables

### ❌ DON'T:
- Commit `.env` files to version control
- Share your `.env` file or keys in public channels
- Use production credentials in development
- Expose service role keys or JWT secrets to the client-side
- Disable Row Level Security without careful consideration

## How Environment Variables Work in This Project

### Important: Angular vs Next.js

This project uses `NEXT_PUBLIC_` prefixed variables for compatibility with external tooling, but **this is an Angular application**. The behavior differs from Next.js:

### Server-Side (SSR)
- Environment variables are loaded from `.env` using dotenv in `src/server.ts`
- All variables are available via `process.env` on the server (Node.js environment)
- Loaded at runtime when the server starts
- ✅ **Both `NEXT_PUBLIC_*` and non-prefixed variables work here**

### Client-Side (Browser)
- Angular doesn't automatically expose `NEXT_PUBLIC_` variables to the browser like Next.js does
- The `supabase.config.ts` checks for environment variables but falls back to defaults in browser context
- For production client-side usage, consider:
  - Using Angular environment files (`src/environments/environment.ts`)
  - Configuring file replacements in `angular.json`
  - Using custom build scripts to inject variables
- ⚠️ **Currently, client-side code uses fallback values defined in `supabase.config.ts`**

### Configuration Priority
The application follows this priority for configuration values:

1. **Server-side**: Environment variables from `.env` file or system environment
2. **Client-side**: Hardcoded defaults in `supabase.config.ts` (as Angular doesn't auto-inject these vars)

### Recommended Approach for Production

For production deployments where client-side code needs dynamic configuration:

1. **Option A**: Use Angular environment files
   ```typescript
   // src/environments/environment.prod.ts
   export const environment = {
     production: true,
     supabaseUrl: 'https://your-project.supabase.co',
     supabaseKey: 'your-anon-key'
   };
   ```

2. **Option B**: Configure angular.json file replacements
   ```json
   "fileReplacements": [
     {
       "replace": "src/environments/environment.ts",
       "with": "src/environments/environment.prod.ts"
     }
   ]
   ```

3. **Option C**: Keep using `.env` for server-side operations only
   - Server-side SSR and API routes use `.env` variables
   - Client-side uses hardcoded values in config files
   - This is the current implementation

## Testing Your Configuration

After setting up your `.env` file:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

3. **Start the SSR server:**
   ```bash
   npm run serve:ssr:ng-gighub
   ```

4. **Verify Supabase connection:**
   - The application should connect to your Supabase project
   - Check browser console for any connection errors
   - Test a simple database query if you have tables set up

## Troubleshooting

### Issue: "YOUR_SUPABASE_ANON_KEY" appears in errors
**Solution:** You haven't set the `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env` file. Copy `.env.example` and add your actual key.

### Issue: Server can't connect to database
**Solution:** 
- Verify your `POSTGRES_URL` or `POSTGRES_*` variables are correct
- Check that your database allows connections from your server's IP
- Ensure your database credentials are valid

### Issue: Client-side Supabase errors
**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check that Row Level Security policies are configured correctly
- Ensure your anon key hasn't been rotated or revoked

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Environment Variables in Angular](https://angular.dev/tools/cli/environments)
