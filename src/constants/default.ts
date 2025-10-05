import { IProjectBase } from '@/types/project.types';
import { ITaskFormData } from '@/types/task.types';

export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';

export const DEFAULT_TASK_FORM_DATA: ITaskFormData = {
  content: '',
  due_date: null,
  projectId: null,
} as const;

export const DEFAULT_PROJECT_FORM_DATA: IProjectBase = {
  id: null,
  name: 'Untitled',
  color_name: 'Slate',
  color_hex: '#64748b',
} as const;
