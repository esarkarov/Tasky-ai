import { PaginatedResponse } from '@/types/pagination.types';
import { Task } from '@/types/tasks.types';
import { Models } from 'appwrite';

export interface Project extends Models.Document {
  userId: string;
  name: string;
  color_name: string;
  color_hex: string;
  tasks: Task[] | null;
}
export interface ProjectBase {
  id: string | null;
  name: string;
  color_name: string;
  color_hex: string;
}
export interface ProjectCreateData {
  name: string;
  color_name: string;
  color_hex: string;
  userId: string;
}
export interface ProjectUpdateData {
  name: string;
  color_name: string;
  color_hex: string;
}
export interface ProjectFormData {
  id?: string | null;
  name: string;
  color_name: string;
  color_hex: string;
  ai_task_gen: boolean;
  task_gen_prompt: string;
}
export interface ProjectInfo {
  name: string;
  colorHex: string;
}
export interface ProjectListItem extends Models.Document {
  $id: string;
  name: string;
  color_name: string;
  color_hex: string;
  $createdAt: string;
}

export type ProjectsListResponse = PaginatedResponse<ProjectListItem>;
