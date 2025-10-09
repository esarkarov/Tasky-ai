import { HttpMethod, SearchStatus } from '@/types/common.types';
import { ProjectBase, ProjectFormData } from '@/types/project.types';
import { TaskFormData } from '@/types/task.types';
import { useFetcher } from 'react-router';

export interface UseProjectOperationsParams {
  method?: HttpMethod;
  projectData?: ProjectBase;
  onSuccess?: () => void;
}

export interface UseProjectOperationsResult {
  saveProject: (data: ProjectFormData) => Promise<void>;
  deleteProject: () => Promise<void>;
  searchProjects: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchStatus: SearchStatus;
  fetcher: ReturnType<typeof useFetcher>;
}

export interface UseTaskOperationsParams {
  onSuccess?: () => void;
  enableUndo?: boolean;
}

export interface UseTaskOperationsResult {
  createTask: (formData: TaskFormData) => Promise<void>;
  updateTask: (formData: TaskFormData, taskId?: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  fetcher: ReturnType<typeof useFetcher>;
}
