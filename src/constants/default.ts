import { ProjectBase } from '@/types/project.types';
import { TaskFormData } from '@/types/task.types';

export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';

export const DEFAULT_TASK_FORM_DATA: TaskFormData = {
  content: '',
  due_date: null,
  projectId: null,
} as const;

export const DEFAULT_PROJECT_FORM_DATA: ProjectBase = {
  id: null,
  name: 'Untitled',
  color_name: 'Slate',
  color_hex: '#64748b',
} as const;
