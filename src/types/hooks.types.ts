import { HttpMethod, SearchStatus } from '@/types/shared.types';
import { ProjectInput, ProjectFormInput } from '@/types/projects.types';
import { TaskFormInput } from '@/types/tasks.types';
import { useFetcher } from 'react-router';

export interface UseProjectOperationsParams {
  method?: HttpMethod;
  projectData?: ProjectInput;
  onSuccess?: () => void;
}

export interface UseProjectOperationsResult {
  saveProject: (data: ProjectFormInput) => Promise<void>;
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
  createTask: (formData: TaskFormInput) => Promise<void>;
  updateTask: (formData: TaskFormInput, taskId?: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  fetcher: ReturnType<typeof useFetcher>;
  formState: boolean;
}
