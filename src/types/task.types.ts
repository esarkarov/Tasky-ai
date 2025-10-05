import { IProject } from '@/types/project.types';
import { Models } from 'appwrite';

export interface ITask extends Models.Document {
  content: string;
  due_date: Date | string | null;
  completed: boolean;
  userId: string;
  projectId: IProject | null;
}
export interface ITasksResponse {
  total: number;
  documents: ITask[];
}
export interface ITaskFormData {
  id?: string;
  content: string;
  due_date: Date | string | null;
  completed?: boolean;
  projectId: string | null;
}
export interface IAIGeneratedTask {
  content: string;
  due_date?: string | null;
  completed?: boolean;
}
export interface ITaskCounts {
  inboxTasks: number;
  todayTasks: number;
}
