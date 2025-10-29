import { ProjectFormInput, ProjectInput } from '@/types/projects.types';
import { HttpMethod, SearchStatus } from '@/types/shared.types';
import { TaskEntity, TaskFormInput } from '@/types/tasks.types';
import { Dispatch, SetStateAction } from 'react';
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

export interface UseProjectFilterParams {
  tasks: TaskEntity[];
}

export interface UseProjectFilterResult {
  filteredTasks: TaskEntity[] | undefined;
  filteredCount: number;
  selectedProjectId: string | null;
  setSelectedProjectId: Dispatch<SetStateAction<string | null>>;
}

export interface UseLoadMoreParams {
  initialCount?: number;
  pageSize?: number;
}
export interface UseLoadMoreResult<T> {
  visibleItems: T[];
  visibleCount: number;
  isLoading: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  reset: () => void;
  getItemClassName: (index: number) => string;
  getItemStyle: (index: number) => React.CSSProperties;
}
