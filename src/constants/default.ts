import { IProject, ITaskForm } from '@/interfaces';

export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';

export const DEFAULT_TASK_FORM_DATA: ITaskForm = {
  content: '',
  due_date: null,
  projectId: null,
} as const;

export const DEFAULT_PROJECT_FORM_DATA: IProject = {
  id: null,
  name: 'Untitled',
  color_name: 'Slate',
  color_hex: '#64748b',
} as const;
