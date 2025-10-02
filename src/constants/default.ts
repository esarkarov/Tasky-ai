import { IProject, ITaskForm } from '@/interfaces';

export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';

export const PROJECT_DEFAULTS = {
  NAME: 'Untitled',
  COLOR_NAME: 'Slate',
  COLOR_HEX: '#64748b',
} as const;

export const DEFAULT_TASK_FORM_DATA: ITaskForm = {
  content: '',
  due_date: null,
  projectId: null,
} as const;

export const DEFAULT_PROJECT_FORM_DATA: IProject = {
  id: null,
  name: PROJECT_DEFAULTS.NAME,
  color_name: PROJECT_DEFAULTS.COLOR_NAME,
  color_hex: PROJECT_DEFAULTS.COLOR_HEX,
} as const;
