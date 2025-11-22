import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/default/default.component').then((m) => m.DefaultLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'organizations',
        pathMatch: 'full',
      },
      {
        path: 'organizations',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/organization/pages/organization-dashboard/organization-dashboard.component'
              ).then((m) => m.OrganizationDashboardComponent),
          },
          {
            path: 'members',
            loadComponent: () =>
              import(
                './features/organization/pages/organization-members/organization-members.component'
              ).then((m) => m.OrganizationMembersComponent),
          },
          {
            path: 'teams',
            loadComponent: () =>
              import(
                './features/organization/pages/organization-teams/organization-teams.component'
              ).then((m) => m.OrganizationTeamsComponent),
          },
          {
            path: 'bots',
            loadComponent: () =>
              import(
                './features/organization/pages/organization-bots/organization-bots.component'
              ).then((m) => m.OrganizationBotsComponent),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import(
                './features/organization/pages/organization-settings/organization-settings.component'
              ).then((m) => m.OrganizationSettingsComponent),
          },
        ],
      },
      {
        path: 'teams',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./features/team/pages/team-detail/team-detail.component').then(
                (m) => m.TeamDetailComponent
              ),
          },
          {
            path: ':id/members',
            loadComponent: () =>
              import('./features/team/pages/team-members/team-members.component').then(
                (m) => m.TeamMembersComponent
              ),
          },
          {
            path: ':id/repositories',
            loadComponent: () =>
              import('./features/team/pages/team-repositories/team-repositories.component').then(
                (m) => m.TeamRepositoriesComponent
              ),
          },
        ],
      },
      {
        path: 'workspaces',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/workspace/pages/workspace-list/workspace-list.component').then(
                (m) => m.WorkspaceListComponent
              ),
          },
        ],
      },
      {
        path: 'repositories',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/repository/pages/repository-list/repository-list.component').then(
                (m) => m.RepositoryListComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './features/repository/pages/repository-detail/repository-detail.component'
              ).then((m) => m.RepositoryDetailComponent),
          },
          {
            path: ':id/collaborators',
            loadComponent: () =>
              import(
                './features/repository/pages/repository-collaborators/repository-collaborators.component'
              ).then((m) => m.RepositoryCollaboratorsComponent),
          },
          {
            path: ':id/settings',
            loadComponent: () =>
              import(
                './features/repository/pages/repository-settings/repository-settings.component'
              ).then((m) => m.RepositorySettingsComponent),
          },
        ],
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./features/account/pages/account-profile/account-profile.component').then(
                (m) => m.AccountProfileComponent
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/account/pages/account-settings/account-settings.component').then(
                (m) => m.AccountSettingsComponent
              ),
          },
          {
            path: 'switcher',
            loadComponent: () =>
              import('./features/account/pages/account-switcher/account-switcher.component').then(
                (m) => m.AccountSwitcherComponent
              ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
