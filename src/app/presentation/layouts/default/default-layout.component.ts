import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AccountSwitcherComponent } from './components/account-switcher/account-switcher.component';

/**
 * Default Layout Component
 * Main layout with account switcher in the sidebar
 */
@Component({
  selector: 'app-default-layout',
  imports: [CommonModule, RouterOutlet, AccountSwitcherComponent],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <app-account-switcher />
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 300px;
      background-color: #f8f9fa;
      border-right: 1px solid #dee2e6;
      padding: 1rem;
    }

    .content {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class DefaultLayoutComponent {}
