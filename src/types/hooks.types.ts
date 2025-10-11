import { HttpMethod, SearchStatus } from '@/types/shared.types';
import { ProjectBase, ProjectFormData } from '@/types/projects.types';
import { TaskFormData } from '@/types/tasks.types';
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
  formState: boolean;
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
  formState: boolean;
}
