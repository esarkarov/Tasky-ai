import { PaginatedResponse } from '@/types/pagination.types';
import { ProjectEntity } from '@/types/projects.types';
import { BaseEntity } from '@/types/shared.types';

export interface TaskEntity extends BaseEntity {
  id: string;
  content: string;
  due_date: Date | null;
  completed: boolean;
  projectId: ProjectEntity | null;
}
export interface AIGeneratedTask {
  content: string;
  due_date?: Date | null;
  completed?: boolean;
}
export interface TaskCounts {
  inboxTasks: number;
  todayTasks: number;
}
export interface TaskInput {
  content: string;
  due_date: Date | null;
  completed: boolean;
  projectId: string | null;
}
export interface TaskFormInput extends Omit<TaskInput, 'completed'> {
  id?: string;
  completed?: boolean;
}
export interface TaskCreateInput extends TaskInput {
  userId: string;
}
export interface TaskUpdateInput extends Omit<TaskInput, 'completed'> {
  completed?: boolean;
}
export type TasksResponse = PaginatedResponse<TaskEntity>;
