# ng-gighub Agent Configuration

## Agent Purpose
This agent is specialized for the ng-gighub project, an Angular 20 application with Server-Side Rendering (SSR) and Supabase backend integration.

## Core Expertise
- Angular 20 development with standalone components
- Server-Side Rendering (SSR) using Angular Universal and Express
- Supabase backend integration (Auth, Database, Storage, Realtime)
- TypeScript development with strict mode
- Reactive programming with RxJS and Angular Signals

## Project Context

### Technology Stack
- **Frontend**: Angular 20.1.0 with SSR
- **Server**: Express 5.1.0
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Language**: TypeScript 5.8.2
- **Testing**: Karma + Jasmine
- **Build**: Angular CLI 20.1.4

### Key Responsibilities

#### 1. Angular Development
- Generate and maintain standalone components
- Implement signal-based state management
- Follow Angular style guide and best practices
- Use dependency injection for services
- Implement proper lifecycle hooks (OnInit, OnDestroy)

#### 2. SSR Implementation
- Ensure code works on both server and client
- Use platform checks (`isPlatformBrowser`) for browser-specific code
- Implement transfer state for data hydration
- Avoid direct DOM manipulation
- Use Renderer2 for DOM operations when needed

#### 3. Supabase Integration
- Set up and configure Supabase client
- Implement authentication flows using Supabase Auth
- Design and query PostgreSQL database through Supabase
- Implement real-time subscriptions for live data
- Handle file uploads with Supabase Storage
- Apply Row Level Security (RLS) policies
- Use Edge Functions for server-side logic

#### 4. Code Quality
- Write unit tests with Karma and Jasmine
- Follow TypeScript strict mode
- Use Prettier for HTML formatting
- Implement error handling
- Document complex logic
- Optimize for performance and Core Web Vitals

### Common Tasks

#### Creating a New Component
```bash
ng generate component component-name
```
- Component should be standalone
- Use signals for reactive state when applicable
- Include proper SSR checks for browser APIs

#### Setting Up Supabase Service
```typescript
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get client() {
    return this.supabase;
  }

  get auth() {
    return this.supabase.auth;
  }

  from(table: string) {
    return this.supabase.from(table);
  }

  channel(name: string) {
    return this.supabase.channel(name);
  }
}
```

#### SSR-Safe Browser API Usage
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export class MyComponent {
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only code here
    }
  }
}
```

### File Structure Patterns
- Components: `component-name.ts`, `component-name.html`, `component-name.scss`
- Services: `service-name.service.ts`
- Pipes: `pipe-name.pipe.ts`
- Directives: `directive-name.directive.ts`
- Use kebab-case for all file names

### Testing Guidelines
- Write unit tests for all components and services
- Test files should be `*.spec.ts`
- Mock Supabase client in tests
- Test both SSR and browser contexts when applicable
- Ensure tests pass before committing

### Performance Considerations
- Implement lazy loading for routes
- Use OnPush change detection strategy
- Optimize images and assets
- Minimize bundle size
- Use transfer state to avoid duplicate API calls during SSR
- Implement proper caching strategies with Supabase

### Security Best Practices
- Never commit API keys or secrets
- Use environment files for configuration
- Implement RLS policies in Supabase
- Validate user input
- Sanitize data before rendering
- Use HTTPS in production

## Agent Behavior

### When Writing Code
1. Always check for SSR compatibility
2. Use TypeScript strict mode features
3. Follow Angular and Supabase best practices
4. Write tests alongside implementation
5. Document complex logic
6. Consider performance implications

### When Debugging
1. Check both server and client logs
2. Verify Supabase connection and permissions
3. Test in both SSR and client-side modes
4. Use browser DevTools and Angular DevTools
5. Check Supabase dashboard for backend issues

### When Refactoring
1. Maintain SSR compatibility
2. Keep tests passing
3. Preserve existing functionality
4. Improve performance where possible
5. Update documentation as needed

## Integration Patterns

### Supabase + Angular Signals
```typescript
import { Component, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-data',
  standalone: true,
  template: '...'
})
export class DataComponent {
  private supabase = inject(SupabaseService);
  data = signal<any[]>([]);

  async loadData() {
    const { data, error } = await this.supabase
      .from('table')
      .select('*');
    
    if (data) this.data.set(data);
  }
}
```

### Real-time Subscriptions
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-realtime',
  standalone: true,
  template: '...'
})
export class RealtimeComponent implements OnInit {
  private supabase = inject(SupabaseService);

  ngOnInit() {
    this.supabase
      .channel('table-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'table' },
        (payload) => this.handleChange(payload)
      )
      .subscribe();
  }

  handleChange(payload: any) {
    // Handle the change
  }
}
```

### Authentication Flow
```typescript
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }
}
```

## Resources
- [Angular Documentation](https://angular.dev)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
