import { ProjectFormInput, ProjectInfo, ProjectInput, ProjectListItem } from '@/types/projects.types';
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
export interface UseTaskFormParams {
  defaultFormData: TaskFormInput;
  projectDocs?: ProjectListItem[];
  onSubmit?: (formData: TaskFormInput, taskId?: string) => Promise<void>;
  onCancel: () => void;
}
export interface UseTaskFormResult {
  taskContent: string;
  dueDate: Date | null;
  projectId: string | null;
  projectInfo: ProjectInfo;
  isSubmitting: boolean;
  isDisabled: boolean;
  formData: TaskFormInput;
  setTaskContent: (content: string) => void;
  setDueDate: (date: Date | null) => void;
  setProjectId: (id: string | null) => void;
  setProjectInfo: (info: ProjectInfo) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

export interface UseProjectFormParams {
  defaultFormData: ProjectInput;
  onSubmit: (formData: ProjectFormInput) => Promise<void>;
}

export interface UseProjectFormResult {
  projectName: string;
  colorName: string;
  colorHex: string;
  aiTaskGen: boolean;
  taskGenPrompt: string;
  isOpen: boolean;
  isSubmitting: boolean;
  isDisabled: boolean;
  formData: ProjectFormInput;
  setProjectName: (name: string) => void;
  setAiTaskGen: (enabled: boolean) => void;
  setTaskGenPrompt: (prompt: string) => void;
  setIsOpen: (open: boolean) => void;
  handleColorSelect: (value: string) => void;
  handleSubmit: () => Promise<void>;
}
