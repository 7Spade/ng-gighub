import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { SupabaseClientService } from '../../../infrastructure/persistence/supabase/supabase.client';
import { FileDto, CreateFileDto, UpdateFileDto } from '../dto/file.dto';

/**
 * File Application Service
 */
@Injectable({
  providedIn: 'root',
})
export class FileApplicationService {
  private readonly supabase = inject(SupabaseClientService);

  listWorkspaceFiles(workspaceId: string): Observable<FileDto[]> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(
      client
        .from('files')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return (response.data || []).map((file: any) => this.mapToFileDto(file));
      })
    );
  }

  getFileById(id: string): Observable<FileDto | null> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(client.from('files').select('*').eq('id', id).single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data ? this.mapToFileDto(response.data) : null;
      })
    );
  }

  createFile(dto: CreateFileDto): Observable<FileDto> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(
      client
        .from('files')
        .insert({
          workspace_id: dto.workspaceId,
          name: dto.name,
          path: dto.path,
          size: dto.size,
          mime_type: dto.mimeType,
          storage_path: dto.storagePath,
          uploaded_by: dto.uploadedBy,
          metadata: dto.metadata || {},
        })
        .select()
        .single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return this.mapToFileDto(response.data);
      })
    );
  }

  updateFile(id: string, dto: UpdateFileDto): Observable<FileDto> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data['name'] = dto.name;
    if (dto.path !== undefined) data['path'] = dto.path;
    if (dto.metadata !== undefined) data['metadata'] = dto.metadata;

    return from(client.from('files').update(data).eq('id', id).select().single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return this.mapToFileDto(response.data);
      })
    );
  }

  deleteFile(id: string): Observable<void> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(client.from('files').delete().eq('id', id)).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return;
      })
    );
  }

  uploadFile(bucket: string, path: string, file: File): Observable<string> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(client.storage.from(bucket).upload(path, file)).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data.path;
      })
    );
  }

  deleteFileFromStorage(bucket: string, path: string): Observable<void> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(client.storage.from(bucket).remove([path])).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return;
      })
    );
  }

  getPublicUrl(bucket: string, path: string): string {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { data } = client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  private mapToFileDto(data: unknown): FileDto {
    const row = data as any;
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      name: row.name,
      path: row.path,
      size: row.size,
      mimeType: row.mime_type,
      storagePath: row.storage_path,
      uploadedBy: row.uploaded_by,
      metadata: row.metadata as Record<string, unknown>,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
