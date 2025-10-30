import { ColorValue, ProjectFormInput, ProjectInput, ProjectListItem, SelectedProject } from '@/types/projects.types';
import { HttpMethod, SearchStatus } from '@/types/shared.types';
import { TaskEntity, TaskFormInput } from '@/types/tasks.types';
import { useFetcher } from 'react-router';
export interface UseProjectOperationsParams {
  method?: HttpMethod;
  projectData?: ProjectInput;
  onSuccess?: () => void;
}
export interface UseProjectOperationsResult {
  handleSaveProject: (data: ProjectFormInput) => Promise<void>;
  handleDeleteProject: () => Promise<void>;
  handleSearchProjects: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchStatus: SearchStatus;
  fetcher: ReturnType<typeof useFetcher>;
  formState: boolean;
}
export interface UseTaskOperationsParams {
  onSuccess?: () => void;
  enableUndo?: boolean;
}
export interface UseTaskOperationsResult {
  handleCreateTask: (formData: TaskFormInput) => Promise<void>;
  handleUpdateTask: (formData: TaskFormInput, taskId?: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  fetcher: ReturnType<typeof useFetcher>;
  formState: boolean;
}
export interface UseProjectFilterParams {
  tasks: TaskEntity[];
}
export interface UseProjectFilterResult {
  filteredTasks: TaskEntity[] | undefined;
  filteredCount: number;
  value: string | null;
  setValue: (value: string | null) => void;
}
export interface UseLoadMoreParams {
  initialCount?: number;
  pageSize?: number;
}
export interface UseLoadMoreResult<T> {
  items: T[];
  count: number;
  isLoading: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  handleReset: () => void;
  getItemClassName: (index: number) => string;
  getItemStyle: (index: number) => React.CSSProperties;
}
export interface UseTaskFormParams {
  defaultValues: TaskFormInput;
  projects?: ProjectListItem[];
  onSubmit?: (formData: TaskFormInput, taskId?: string) => Promise<void>;
  handleCancel: () => void;
}
export interface UseTaskFormResult {
  content: string;
  dueDate: Date | null;
  selectedProject: SelectedProject;
  isSubmitting: boolean;
  isValid: boolean;
  formValues: TaskFormInput;
  setContent: (content: string) => void;
  setDueDate: (date: Date | null) => void;
  handleProjectChange: (project: SelectedProject) => void;
  removeDueDate: () => void;
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
}

export interface UseProjectFormParams {
  defaultValues: ProjectInput;
  onSubmit: (formData: ProjectFormInput) => Promise<void>;
}

export interface UseProjectFormResult {
  name: string;
  color: ColorValue;
  aiEnabled: boolean;
  aiPrompt: string;
  colorPickerOpen: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  formValues: ProjectFormInput;
  setName: (name: string) => void;
  setColor: (value: ColorValue) => void;
  setAiEnabled: (enabled: boolean) => void;
  setAiPrompt: (prompt: string) => void;
  setColorPickerOpen: (open: boolean) => void;
  handleColorSelect: (value: string) => void;
  handleSubmit: () => Promise<void>;
}
