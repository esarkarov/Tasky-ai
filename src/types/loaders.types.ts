import { Project, ProjectsListResponse } from '@/types/projects.types';
import { TaskCounts, TasksResponse } from '@/types/tasks.types';

export interface AppLoaderData {
  projects: ProjectsListResponse;
  taskCounts: TaskCounts;
}
export interface TasksLoaderData {
  tasks: TasksResponse;
}
export interface ProjectDetailLoaderData {
  project: Project;
}
export interface ProjectsLoaderData {
  projects: ProjectsListResponse;
}
