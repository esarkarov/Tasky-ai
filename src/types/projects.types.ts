import { PaginatedResponse } from '@/types/pagination.types';
import { BaseEntity } from '@/types/shared.types';
import { TaskEntity } from '@/types/tasks.types';

export interface ProjectEntity extends BaseEntity {
  userId: string;
  name: string;
  color_name: string;
  color_hex: string;
  tasks: TaskEntity[] | null;
}
export interface ProjectListItem extends BaseEntity {
  name: string;
  color_name: string;
  color_hex: string;
}
export interface ProjectInput {
  id?: string | null;
  name: string;
  color_name: string;
  color_hex: string;
}
export interface ProjectInfo {
  name: string;
  colorHex: string;
}
export interface ProjectFormInput extends ProjectInput {
  ai_task_gen: boolean;
  task_gen_prompt: string;
}
export interface ProjectCreateInput extends ProjectInput {
  userId: string;
}
export type ProjectUpdateInput = ProjectInput;
export type ProjectsListResponse = PaginatedResponse<ProjectListItem>;
