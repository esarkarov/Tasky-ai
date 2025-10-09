import { THttpMethod, TSearchStatus } from '@/types';
import { IProjectBase, IProjectFormData } from '@/types/project.types';
import { ITaskFormData } from '@/types/task.types';
import { useFetcher } from 'react-router';

export interface IUseProjectOperationsParams {
  method?: THttpMethod;
  projectData?: IProjectBase;
  onSuccess?: () => void;
}

export interface IUseProjectOperationsResult {
  saveProject: (data: IProjectFormData) => Promise<void>;
  deleteProject: () => Promise<void>;
  searchProjects: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchStatus: TSearchStatus;
  fetcher: ReturnType<typeof useFetcher>;
}

export interface IUseTaskOperationsParams {
  onSuccess?: () => void;
  enableUndo?: boolean;
}

export interface IUseTaskOperationsResult {
  createTask: (formData: ITaskFormData) => Promise<void>;
  updateTask: (formData: ITaskFormData, taskId?: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  fetcher: ReturnType<typeof useFetcher>;
}
