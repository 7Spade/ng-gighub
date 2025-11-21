# Supabase Configuration

To configure Supabase for this project:

## Using Environment Variables (Recommended)

1. Copy `.env.example` to create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Go to your Supabase project dashboard at https://pfxxjtvnqptdvjfakotc.supabase.co

3. Navigate to Settings > API

4. Update the `.env` file with your actual values:
   - `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key
   - (Optional) `SUPABASE_SERVICE_ROLE_KEY`: Service role key for server-side operations
   - (Optional) `SUPABASE_JWT_SECRET`: JWT secret for token verification
   - (Optional) PostgreSQL connection strings if needed

5. **Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

## Alternative: Manual Configuration

If you prefer not to use environment variables, you can update the values directly in `src/app/config/supabase.config.ts`:
   - Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key

**Note:** Environment variables take priority over hardcoded values in the config file.

## Using Supabase Service

The `SupabaseService` is configured to only initialize on the browser side (not during SSR) to ensure compatibility with Angular's Server-Side Rendering.

### Database Operations

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

### Storage Operations

The service includes comprehensive storage methods for file management:

#### Upload a File

```typescript
async uploadFile(file: File) {
  const { data, error } = await this.supabase.uploadFile(
    'my-bucket',           // bucket name
    `uploads/${file.name}`, // file path
    file,                   // file object
    { upsert: true }        // optional: overwrite if exists
  );

  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('File uploaded:', data);
  }
}
```

#### Download a File

```typescript
async downloadFile(path: string) {
  const { data, error } = await this.supabase.downloadFile('my-bucket', path);
  
  if (error) {
    console.error('Download error:', error);
  } else {
    // Create a download link
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filename.ext';
    link.click();
  }
}
```

#### Get Public URL

```typescript
getFileUrl(path: string) {
  const { data } = this.supabase.getPublicUrl('my-bucket', path);
  return data.publicUrl;
}
```

#### Get Signed URL (for private files)

```typescript
async getPrivateFileUrl(path: string) {
  const { data, error } = await this.supabase.createSignedUrl(
    'my-bucket',
    path,
    3600  // expires in 1 hour
  );
  
  if (error) {
    console.error('Error creating signed URL:', error);
  } else {
    return data.signedUrl;
  }
}
```

#### List Files

```typescript
async listFiles(folder: string) {
  const { data, error } = await this.supabase.listFiles(
    'my-bucket',
    folder,
    { 
      limit: 100,
      sortBy: { column: 'name', order: 'asc' }
    }
  );
  
  if (error) {
    console.error('List error:', error);
  } else {
    console.log('Files:', data);
  }
}
```

#### Delete Files

```typescript
async deleteFile(path: string) {
  const { data, error } = await this.supabase.deleteFile('my-bucket', path);
  
  if (error) {
    console.error('Delete error:', error);
  } else {
    console.log('File deleted');
  }
}

// Delete multiple files
async deleteMultipleFiles(paths: string[]) {
  const { data, error } = await this.supabase.deleteFile('my-bucket', paths);
}
```

#### Move/Rename File

```typescript
async moveFile(oldPath: string, newPath: string) {
  const { data, error } = await this.supabase.moveFile(
    'my-bucket',
    oldPath,
    newPath
  );
  
  if (error) {
    console.error('Move error:', error);
  } else {
    console.log('File moved');
  }
}
```

#### Copy File

```typescript
async copyFile(sourcePath: string, destPath: string) {
  const { data, error } = await this.supabase.copyFile(
    'my-bucket',
    sourcePath,
    destPath
  );
  
  if (error) {
    console.error('Copy error:', error);
  } else {
    console.log('File copied');
  }
}
```

## Storage Bucket Setup

Before using storage operations, ensure you have:

1. Created storage buckets in your Supabase project (Storage section in dashboard)
2. Set appropriate permissions and policies for your buckets
3. Configured CORS if accessing from different domains

## Important Notes

- The Supabase client is only available in the browser (client-side)
- Always check if `client` is not null before using it
- Storage methods handle SSR gracefully and return appropriate errors
- Keep your anon key in the config file (it's safe for client-side use)
- Never commit sensitive keys like service_role keys to the repository
- Use signed URLs for private file access
- Consider implementing proper Row Level Security (RLS) policies for storage buckets
