import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { SupabaseClientService } from '../../../infrastructure/persistence/supabase/supabase.client';
import {
  TaskDto,
  CreateTaskDto,
  UpdateTaskDto,
  TaskCommentDto,
  CreateTaskCommentDto,
} from '../dto/task.dto';

/**
 * Task Application Service
 */
@Injectable({
  providedIn: 'root',
})
export class TaskApplicationService {
  private readonly supabase = inject(SupabaseClientService);

  listWorkspaceTasks(workspaceId: string, status?: string): Observable<TaskDto[]> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    let query = client
      .from('tasks')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    return from(query).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return (response.data || []).map((task: any) => this.mapToTaskDto(task));
      })
    );
  }

  getTaskById(id: string): Observable<TaskDto | null> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(client.from('tasks').select('*').eq('id', id).single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data ? this.mapToTaskDto(response.data) : null;
      })
    );
  }

  createTask(dto: CreateTaskDto): Observable<TaskDto> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(
      client
        .from('tasks')
        .insert({
          workspace_id: dto.workspaceId,
          title: dto.title,
          description: dto.description,
          status: dto.status || 'todo',
          priority: dto.priority || 'medium',
          due_date: dto.dueDate,
          assignee_id: dto.assigneeId,
          created_by: dto.createdBy,
          metadata: dto.metadata || {},
        })
        .select()
        .single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return this.mapToTaskDto(response.data);
      })
    );
  }

  updateTask(id: string, dto: UpdateTaskDto): Observable<TaskDto> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data['title'] = dto.title;
    if (dto.description !== undefined) data['description'] = dto.description;
    if (dto.status !== undefined) data['status'] = dto.status;
    if (dto.priority !== undefined) data['priority'] = dto.priority;
    if (dto.dueDate !== undefined) data['due_date'] = dto.dueDate;
    if (dto.assigneeId !== undefined) data['assignee_id'] = dto.assigneeId;
    if (dto.metadata !== undefined) data['metadata'] = dto.metadata;

    return from(client.from('tasks').update(data).eq('id', id).select().single()).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return this.mapToTaskDto(response.data);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(client.from('tasks').delete().eq('id', id)).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return;
      })
    );
  }

  listTaskComments(taskId: string): Observable<TaskCommentDto[]> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(
      client
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true })
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return (response.data || []).map((comment: any) => this.mapToTaskCommentDto(comment));
      })
    );
  }

  createTaskComment(dto: CreateTaskCommentDto): Observable<TaskCommentDto> {
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not available');

    return from(
      client
        .from('task_comments')
        .insert({
          task_id: dto.taskId,
          author_id: dto.authorId,
          content: dto.content,
          metadata: dto.metadata || {},
        })
        .select()
        .single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return this.mapToTaskCommentDto(response.data);
      })
    );
  }

  private mapToTaskDto(data: any): TaskDto {
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      assigneeId: data.assignee_id,
      createdBy: data.created_by,
      metadata: data.metadata as Record<string, unknown>,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapToTaskCommentDto(data: any): TaskCommentDto {
    return {
      id: data.id,
      taskId: data.task_id,
      authorId: data.author_id,
      content: data.content,
      metadata: data.metadata as Record<string, unknown>,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
