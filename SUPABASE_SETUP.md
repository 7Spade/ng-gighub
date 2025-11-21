# Supabase Configuration

To configure Supabase for this project:

1. Go to your Supabase project dashboard at https://pfxxjtvnqptdvjfakotc.supabase.co
2. Navigate to Settings > API
3. Copy your project URL and anon/public key
4. Update the values in `src/app/config/supabase.config.ts`:
   - Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key

## Using Supabase Service

The `SupabaseService` is configured to only initialize on the browser side (not during SSR) to ensure compatibility with Angular's Server-Side Rendering.

### Example Usage

```typescript
import { Component, inject } from '@angular/core';
import { SupabaseService } from './services/supabase.service';

export class MyComponent {
  private supabase = inject(SupabaseService);

  async loadData() {
    // Option 1: Check if client is available
    if (this.supabase.isClientAvailable()) {
      const client = this.supabase.client!; // Safe to use non-null assertion
      const { data, error } = await client
        .from('your_table')
        .select('*');
      
      if (error) {
        console.error('Error loading data:', error);
      } else {
        console.log('Data:', data);
      }
    }

    // Option 2: Check client directly
    const client = this.supabase.client;
    if (client) {
      const { data, error } = await client
        .from('your_table')
        .select('*');
      
      if (error) {
        console.error('Error loading data:', error);
      } else {
        console.log('Data:', data);
      }
    }
  }
}
```

## Important Notes

- The Supabase client is only available in the browser (client-side)
- Always check if `client` is not null before using it
- Keep your anon key in the config file (it's safe for client-side use)
- Never commit sensitive keys like service_role keys to the repository
