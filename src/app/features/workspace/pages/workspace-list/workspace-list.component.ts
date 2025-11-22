import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkspaceApplicationService } from '../../../../core/application/workspace/services/workspace-application.service';
import { WorkspaceWithMemberDto } from '../../../../core/application/workspace/dto/workspace.dto';

/**
 * Workspace List Component
 * 顯示使用者可存取的工作區列表
 */
@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class WorkspaceListComponent implements OnInit {
  private readonly workspaceService = inject(WorkspaceApplicationService);
  private readonly router = inject(Router);

  workspaces = signal<WorkspaceWithMemberDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.loading.set(true);
    this.error.set(null);

    this.workspaceService.listUserWorkspaces().subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load workspaces:', err);
        this.error.set('載入工作區失敗');
        this.loading.set(false);
      },
    });
  }

  navigateToWorkspace(workspaceId: string): void {
    this.router.navigate(['/workspaces', workspaceId]);
  }

}
