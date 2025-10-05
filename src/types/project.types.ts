import { Models } from 'appwrite';
import { ITask } from '@/types/task.types';

export interface IProject extends Models.Document {
  userId: string;
  name: string;
  color_name: string;
  color_hex: string;
  tasks: ITask | null;
}
export interface IProjectBase {
  id: string | null;
  name: string;
  color_name: string;
  color_hex: string;
}
export interface IProjectFormData {
  id?: string | null;
  name: string;
  color_name: string;
  color_hex: string;
  ai_task_gen: boolean;
  task_gen_prompt: string;
}
export interface IProjectInfo {
  name: string;
  colorHex: string;
}
export interface IProjectListItem extends Models.Document {
  $id: string;
  name: string;
  color_name: string;
  color_hex: string;
  $createdAt: string;
}
export interface IProjectsListResponse {
  total: number;
  documents: IProjectListItem[];
}
