// ============================================================================
// Auth Guard Implementation Examples
// ============================================================================
// This file provides complete implementation examples for various guards
// used in ng-gighub project for authentication and authorization
// ============================================================================

import { inject } from '@angular/core';
import { 
  Router, 
  CanActivateFn, 
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree 
} from '@angular/router';
import { AuthService } from './auth-service.example';

// ============================================================================
// 1. Auth Guard - Basic Authentication Check
// ============================================================================

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth initialization if loading
  while (authService.loading()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    // Redirect to login with return URL
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};

// ============================================================================
// 2. Guest Guard - Redirect authenticated users
// ============================================================================

export const guestGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth initialization
  while (authService.loading()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // If authenticated, redirect to home
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  return true;
};

// ============================================================================
// 3. Permission Guard - Check specific permissions
// ============================================================================

export interface PermissionGuardData {
  permissions: string[];
  requireAll?: boolean; // If true, user must have ALL permissions
}

export const permissionGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication first
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Get required permissions from route data
  const data = route.data as PermissionGuardData;
  const requiredPermissions = data.permissions || [];
  const requireAll = data.requireAll ?? true;

  if (requiredPermissions.length === 0) {
    return true; // No permissions required
  }

  // Check permissions (implement your permission service)
  // const permissionService = inject(PermissionService);
  // const hasPermission = requireAll
  //   ? await permissionService.hasAllPermissions(requiredPermissions)
  //   : await permissionService.hasAnyPermission(requiredPermissions);

  // For this example, assume we have a simple check
  const hasPermission = true; // Replace with actual permission check

  if (!hasPermission) {
    return router.createUrlTree(['/403']); // Forbidden
  }

  return true;
};

// ============================================================================
// 4. Role Guard - Check user roles
// ============================================================================

export interface RoleGuardData {
  roles: string[];
  requireAll?: boolean;
}

export const roleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Get required roles from route data
  const data = route.data as RoleGuardData;
  const requiredRoles = data.roles || [];
  const requireAll = data.requireAll ?? false;

  if (requiredRoles.length === 0) {
    return true;
  }

  // Get user roles from user metadata or separate service
  const user = authService.getUser();
  const userRoles = (user?.app_metadata?.roles as string[]) || [];

  // Check if user has required roles
  const hasRole = requireAll
    ? requiredRoles.every(role => userRoles.includes(role))
    : requiredRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    return router.createUrlTree(['/403']);
  }

  return true;
};

// ============================================================================
// 5. Tenant Guard - Check tenant access
// ============================================================================

export const tenantGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Get tenant slug from route params
  const tenantSlug = route.params['tenantSlug'];

  if (!tenantSlug) {
    return router.createUrlTree(['/']);
  }

  // Check if user has access to this tenant
  // Implement your tenant service
  // const tenantService = inject(TenantService);
  // const hasAccess = await tenantService.checkAccess(tenantSlug);

  const hasAccess = true; // Replace with actual check

  if (!hasAccess) {
    return router.createUrlTree(['/404']);
  }

  return true;
};

// ============================================================================
// 6. Email Verified Guard - Check if email is verified
// ============================================================================

export const emailVerifiedGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Check if email is verified
  const user = authService.getUser();
  const emailVerified = user?.email_confirmed_at !== null;

  if (!emailVerified) {
    return router.createUrlTree(['/verify-email'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};

// ============================================================================
// 7. Organization Admin Guard - Check organization admin role
// ============================================================================

export const orgAdminGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // Get organization ID from route
  const orgId = route.params['orgId'];

  if (!orgId) {
    return router.createUrlTree(['/']);
  }

  // Check if user is admin of this organization
  // const orgService = inject(OrganizationService);
  // const isAdmin = await orgService.isUserAdmin(authService.getUserId(), orgId);

  const isAdmin = true; // Replace with actual check

  if (!isAdmin) {
    return router.createUrlTree(['/403']);
  }

  return true;
};

// ============================================================================
// Usage Examples in Routes
// ============================================================================

/*
import { Routes } from '@angular/router';
import { 
  authGuard, 
  guestGuard, 
  permissionGuard,
  roleGuard,
  tenantGuard,
  emailVerifiedGuard,
  orgAdminGuard
} from './guards';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard] // Only for non-authenticated users
  },

  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // Basic authentication check
  },

  // Routes requiring specific permissions
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: ['admin:access', 'system:manage'],
      requireAll: true
    }
  },

  // Routes requiring specific roles
  {
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['moderator', 'admin'],
      requireAll: false // User needs any of these roles
    }
  },

  // Tenant-based routes
  {
    path: ':tenantSlug',
    canActivate: [authGuard, tenantGuard],
    children: [
      {
        path: 'repositories',
        component: RepositoriesComponent
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [permissionGuard],
        data: {
          permissions: ['organization:settings:update']
        }
      }
    ]
  },

  // Email verification required
  {
    path: 'sensitive-data',
    component: SensitiveDataComponent,
    canActivate: [authGuard, emailVerifiedGuard]
  },

  // Organization admin routes
  {
    path: 'organizations/:orgId/admin',
    component: OrgAdminComponent,
    canActivate: [authGuard, orgAdminGuard]
  },

  // Multiple guards combined
  {
    path: 'super-secret',
    component: SuperSecretComponent,
    canActivate: [
      authGuard,
      emailVerifiedGuard,
      roleGuard,
      permissionGuard
    ],
    data: {
      roles: ['admin'],
      permissions: ['secret:access']
    }
  }
];
*/

// ============================================================================
// Child Route Guards
// ============================================================================

// canActivateChild is used to protect all child routes
export const authChildGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  // Same logic as authGuard, but applies to all children
  return authGuard(route, state);
};

/*
// Usage:
{
  path: 'protected',
  canActivateChild: [authChildGuard],
  children: [
    { path: 'page1', component: Page1Component },
    { path: 'page2', component: Page2Component },
    // All children are automatically protected
  ]
}
*/

// ============================================================================
// Deactivate Guard - Prevent navigation away from unsaved changes
// ============================================================================

export interface CanDeactivateComponent {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const canDeactivateGuard: CanActivateFn = async (
  component: any
): Promise<boolean> => {
  // Check if component has unsaved changes
  if ('canDeactivate' in component) {
    return await component.canDeactivate();
  }
  
  return true;
};

/*
// Usage in component:
@Component({...})
export class EditComponent implements CanDeactivateComponent {
  hasUnsavedChanges = false;

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }
}

// In routes:
{
  path: 'edit/:id',
  component: EditComponent,
  canDeactivate: [canDeactivateGuard]
}
*/

// ============================================================================
// Helper Functions
// ============================================================================

// Check multiple permissions
async function checkPermissions(
  permissions: string[],
  requireAll: boolean
): Promise<boolean> {
  // Implement your permission checking logic
  // This is a placeholder
  return true;
}

// Check multiple roles
function checkRoles(
  userRoles: string[],
  requiredRoles: string[],
  requireAll: boolean
): boolean {
  return requireAll
    ? requiredRoles.every(role => userRoles.includes(role))
    : requiredRoles.some(role => userRoles.includes(role));
}
