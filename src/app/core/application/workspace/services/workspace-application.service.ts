import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { SupabaseClientService } from '../../../infrastructure/persistence/supabase/supabase.client';
import {
  WorkspaceDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceWithMemberDto,
} from '../dto/workspace.dto';

/**
 * Workspace Application Service
 * 處理工作區的業務邏輯與資料存取
 */
@Injectable({
  providedIn: 'root',
})
export class WorkspaceApplicationService {
  private readonly supabase = inject(SupabaseClientService);

  /**
   * 列出使用者可存取的工作區
   */
  listUserWorkspaces(): Observable<WorkspaceWithMemberDto[]> {
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(
      client
        .from('workspaces')
        .select(
          `
          *,
          workspace_members!inner(
            role,
            account_id
          )
        `
        )
        .eq('is_active', true)
        .order('created_at', { ascending: false })
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return (response.data || []).map((workspace) =>
          this.mapToWorkspaceWithMemberDto(workspace)
        );
      })
    );
  }

  /**
   * 取得單一工作區
   */
  getWorkspaceById(id: string): Observable<WorkspaceDto | null> {
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(client.from('workspaces').select('*').eq('id', id).single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data ? this.mapToWorkspaceDto(response.data) : null;
      })
    );
  }

  /**
   * 取得工作區 by slug
   */
  getWorkspaceBySlug(slug: string): Observable<WorkspaceDto | null> {
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(client.from('workspaces').select('*').eq('slug', slug).single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data ? this.mapToWorkspaceDto(response.data) : null;
      })
    );
  }

  /**
   * 建立工作區
   */
  createWorkspace(dto: CreateWorkspaceDto): Observable<WorkspaceDto> {
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const data = {
      type: dto.type,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      owner_id: dto.ownerId,
      avatar_url: dto.avatarUrl,
      settings: dto.settings || {},
      metadata: dto.metadata || {},
    };

    return from(client.from('workspaces').insert(data).select().single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return this.mapToWorkspaceDto(response.data);
      })
    );
  }

  /**
   * 更新工作區
   */
  updateWorkspace(id: string, dto: UpdateWorkspaceDto): Observable<WorkspaceDto> {
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data['name'] = dto.name;
    if (dto.description !== undefined) data['description'] = dto.description;
    if (dto.avatarUrl !== undefined) data['avatar_url'] = dto.avatarUrl;
    if (dto.settings !== undefined) data['settings'] = dto.settings;
    if (dto.metadata !== undefined) data['metadata'] = dto.metadata;
    if (dto.isActive !== undefined) data['is_active'] = dto.isActive;

    return from(client.from('workspaces').update(data).eq('id', id).select().single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return this.mapToWorkspaceDto(response.data);
      })
    );
  }

  /**
   * 刪除工作區
   */
  deleteWorkspace(id: string): Observable<void> {
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(client.from('workspaces').delete().eq('id', id)).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return;
      })
    );
  }

  /**
   * 列出工作區成員
   */
  listWorkspaceMembers(workspaceId: string): Observable<unknown[]> {
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    return from(
      client
        .from('workspace_members')
        .select('*, accounts(*)')
        .eq('workspace_id', workspaceId)
        .order('joined_at', { ascending: false })
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data || [];
      })
    );
  }

  /**
   * Map database row to WorkspaceDto
   */
  private mapToWorkspaceDto(data: any): WorkspaceDto {
    return {
      id: data.id,
      type: data.type,
      name: data.name,
      slug: data.slug,
      description: data.description,
      ownerId: data.owner_id,
      avatarUrl: data.avatar_url,
      settings: data.settings as Record<string, unknown>,
      metadata: data.metadata as Record<string, unknown>,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Map database row with member info to WorkspaceWithMemberDto
   */
  private mapToWorkspaceWithMemberDto(data: any): WorkspaceWithMemberDto {
    const workspace = this.mapToWorkspaceDto(data);
    const members = data.workspace_members || [];
    return {
      ...workspace,
      memberRole: members[0]?.role,
      memberCount: members.length,
    };
  }
}
