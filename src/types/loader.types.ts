import { IProject, IProjectsListResponse } from '@/types/project.types';
import { ITaskCounts, ITasksResponse } from '@/types/task.types';

export interface IAppLoaderData {
  projects: IProjectsListResponse;
  taskCounts: ITaskCounts;
}
export interface ITasksLoaderData {
  tasks: ITasksResponse;
}
export interface IProjectDetailLoaderData {
  project: IProject;
}
export interface IProjectsLoaderData {
  projects: IProjectsListResponse;
}
