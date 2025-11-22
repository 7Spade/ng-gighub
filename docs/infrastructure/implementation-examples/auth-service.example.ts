// ============================================================================
// Auth Service Implementation Example
// ============================================================================
// This file provides a complete implementation example for authentication
// service in ng-gighub project using Angular 20 + Supabase
// ============================================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { 
  SupabaseClient, 
  createClient, 
  Session, 
  User,
  AuthError 
} from '@supabase/supabase-js';
import { environment } from '@/environments/environment';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

interface AuthResult {
  success: boolean;
  error?: AuthError;
  user?: User;
  session?: Session;
}

// ============================================================================
// Auth Service
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  // Supabase client
  private supabase: SupabaseClient;
  
  // Auth state signals
  private authState = signal<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });
  
  // Public computed signals
  public user = computed(() => this.authState().user);
  public session = computed(() => this.authState().session);
  public loading = computed(() => this.authState().loading);
  public error = computed(() => this.authState().error);
  public isAuthenticated = computed(() => !!this.authState().user);
  
  // Token refresh interval
  private refreshInterval?: NodeJS.Timeout;
  
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
    
    this.initializeAuth();
  }
  
  // ============================================================================
  // Initialization
  // ============================================================================
  
  private async initializeAuth(): Promise<void> {
    try {
      // Get initial session
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        this.updateAuthState(session.user, session);
        this.startTokenRefresh();
      }
      
      // Listen for auth state changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth event:', event);
        
        switch (event) {
          case 'SIGNED_IN':
            this.handleSignIn(session);
            break;
          case 'SIGNED_OUT':
            this.handleSignOut();
            break;
          case 'TOKEN_REFRESHED':
            this.handleTokenRefresh(session);
            break;
          case 'USER_UPDATED':
            this.handleUserUpdate(session);
            break;
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.updateAuthState(null, null, error as AuthError);
    } finally {
      this.setLoading(false);
    }
  }
  
  // ============================================================================
  // Sign In / Sign Up
  // ============================================================================
  
  async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    try {
      this.setLoading(true);
      this.clearError();
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        this.updateAuthState(null, null, error);
        return { success: false, error };
      }
      
      this.updateAuthState(data.user, data.session);
      this.startTokenRefresh();
      
      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      const authError = error as AuthError;
      this.updateAuthState(null, null, authError);
      return { success: false, error: authError };
    } finally {
      this.setLoading(false);
    }
  }
  
  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    try {
      this.setLoading(true);
      this.clearError();
      
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            display_name: credentials.displayName
          }
        }
      });
      
      if (error) {
        this.updateAuthState(null, null, error);
        return { success: false, error };
      }
      
      // Note: User may need to confirm email
      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      const authError = error as AuthError;
      this.updateAuthState(null, null, authError);
      return { success: false, error: authError };
    } finally {
      this.setLoading(false);
    }
  }
  
  // ============================================================================
  // OAuth Sign In
  // ============================================================================
  
  async signInWithOAuth(
    provider: 'google' | 'github' | 'gitlab'
  ): Promise<AuthResult> {
    try {
      this.setLoading(true);
      
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        this.updateAuthState(null, null, error);
        return { success: false, error };
      }
      
      // User will be redirected to OAuth provider
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      this.updateAuthState(null, null, authError);
      return { success: false, error: authError };
    }
  }
  
  // ============================================================================
  // Sign Out
  // ============================================================================
  
  async signOut(): Promise<void> {
    try {
      this.setLoading(true);
      
      const { error } = await this.supabase.auth.signOut();
      
      if (error) throw error;
      
      this.stopTokenRefresh();
      this.updateAuthState(null, null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      this.setLoading(false);
    }
  }
  
  // ============================================================================
  // Token Refresh
  // ============================================================================
  
  private startTokenRefresh(): void {
    // Refresh token every 55 minutes (5 minutes before expiry)
    const refreshTime = 55 * 60 * 1000;
    
    this.stopTokenRefresh(); // Clear existing interval
    
    this.refreshInterval = setInterval(async () => {
      await this.refreshSession();
    }, refreshTime);
  }
  
  private stopTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
    }
  }
  
  async refreshSession(): Promise<void> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (data.session) {
        this.updateAuthState(data.user, data.session);
        console.log('Session refreshed successfully');
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      await this.signOut();
    }
  }
  
  // ============================================================================
  // Password Management
  // ============================================================================
  
  async resetPasswordRequest(email: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) return { success: false, error };
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error as AuthError };
    }
  }
  
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) return { success: false, error };
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error as AuthError };
    }
  }
  
  // ============================================================================
  // Event Handlers
  // ============================================================================
  
  private handleSignIn(session: Session | null): void {
    if (session) {
      this.updateAuthState(session.user, session);
      this.startTokenRefresh();
      console.log('User signed in:', session.user.email);
    }
  }
  
  private handleSignOut(): void {
    this.stopTokenRefresh();
    this.updateAuthState(null, null);
    console.log('User signed out');
  }
  
  private handleTokenRefresh(session: Session | null): void {
    if (session) {
      this.updateAuthState(session.user, session);
      console.log('Token refreshed');
    }
  }
  
  private handleUserUpdate(session: Session | null): void {
    if (session) {
      this.updateAuthState(session.user, session);
      console.log('User updated');
    }
  }
  
  // ============================================================================
  // State Management
  // ============================================================================
  
  private updateAuthState(
    user: User | null,
    session: Session | null,
    error: AuthError | null = null
  ): void {
    this.authState.set({
      user,
      session,
      loading: false,
      error
    });
  }
  
  private setLoading(loading: boolean): void {
    this.authState.update(state => ({ ...state, loading }));
  }
  
  private clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }
  
  // ============================================================================
  // Utility Methods
  // ============================================================================
  
  getAccessToken(): string | null {
    return this.session()?.access_token || null;
  }
  
  getUser(): User | null {
    return this.user();
  }
  
  getUserId(): string | null {
    return this.user()?.id || null;
  }
  
  getUserEmail(): string | null {
    return this.user()?.email || null;
  }
}

// ============================================================================
// Usage Example
// ============================================================================

/*
// In a component:
import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="email" type="email" required />
      <input [(ngModel)]="password" type="password" required />
      <button type="submit" [disabled]="authService.loading()">
        Sign In
      </button>
      
      @if (authService.error()) {
        <div class="error">{{ authService.error()?.message }}</div>
      }
    </form>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  
  email = '';
  password = '';
  
  async onSubmit() {
    const result = await this.authService.signIn({
      email: this.email,
      password: this.password
    });
    
    if (result.success) {
      // Navigate to home or dashboard
    }
  }
}
*/
