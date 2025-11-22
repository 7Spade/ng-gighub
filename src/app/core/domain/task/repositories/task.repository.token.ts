import { InjectionToken } from '@angular/core';
import { ITaskRepository } from '../repositories/task.repository.interface';

/**
 * Injection Token for Task Repository
 * 任務儲存庫注入標記
 *
 * 用於依賴注入 ITaskRepository 實作
 */
export const TASK_REPOSITORY_TOKEN = new InjectionToken<ITaskRepository>('ITaskRepository');
