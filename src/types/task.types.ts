import { PaginatedResponse } from '@/types/pagination.types';
import { Project } from '@/types/project.types';
import { Models } from 'appwrite';

export interface Task extends Models.Document {
  id: string;
  content: string;
  due_date: Date | null;
  completed: boolean;
  projectId: Project | null;
}
export interface TaskFormData {
  id?: string;
  content: string;
  due_date: Date | null;
  completed?: boolean;
  projectId: string | null;
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
export type TasksResponse = PaginatedResponse<Task>;
