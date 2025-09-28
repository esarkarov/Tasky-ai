import {
  completedTaskEmptyState,
  inboxTaskEmptyState,
  projectTaskEmptyState,
  todayTaskEmptyState,
  upcomingTaskEmptyState,
} from '@/assets';
import { IEmptyStateContent, IProject, ITaskForm } from '@/interfaces';
import { TEmptyStateType } from '@/types';
import { Calendar1, CalendarDays, CircleCheck, Inbox } from 'lucide-react';

export const TIMEOUT_DELAY = 500;
export const SCROLL_THRESHOLD = 70;
export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_PROJECT_NAME = 'Untitled';
const DEFAULT_PROJECT_COLOR_NAME = 'Slate';
const DEFAULT_PROJECT_COLOR_HEX = '#64748b';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_SYNC: '/auth-sync',

  APP: '/app',
  INBOX: '/app/inbox',
  TODAY: '/app/today',
  UPCOMING: '/app/upcoming',
  COMPLETED: '/app/completed',
  PROJECT: (id: string | undefined) => `/app/projects/${id}`,

  APP_PATHS: {
    INBOX: 'inbox',
    TODAY: 'today',
    UPCOMING: 'upcoming',
    COMPLETED: 'completed',
    PROJECTS: 'projects',
  },
} as const;

export const HTTP_METHODS = {
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  GET: 'GET',
} as const;

export const SOCIAL_LINKS = [
  {
    href: 'https://linkedin.com/in/elvinsarkarov',
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/esarkarov',
    label: 'GitHub',
  },
] as const;

export const SIDEBAR_LINKS = [
  {
    href: '/app/inbox',
    label: 'Inbox',
    icon: Inbox,
  },
  {
    href: '/app/today',
    label: 'Today',
    icon: Calendar1,
  },
  {
    href: '/app/upcoming',
    label: 'Upcoming',
    icon: CalendarDays,
  },
  {
    href: '/app/completed',
    label: 'Completed',
    icon: CircleCheck,
  },
] as const;

export const RELATIVE_DAYS = [
  'Today',
  'Tomorrow',
  'Yesterday',
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const EMPTY_STATES: Record<TEmptyStateType, IEmptyStateContent> = {
  today: {
    img: {
      src: todayTaskEmptyState,
      width: 226,
      height: 260,
    },
    title: 'What do you need to get done today?',
    description: 'By default, tasks added here will be due today. Click + to add a task.',
  },
  inbox: {
    img: {
      src: inboxTaskEmptyState,
      width: 344,
      height: 260,
    },
    title: 'What’s on your mind?',
    description: 'Capture tasks that don’t have a specific category. Click + to add a task.',
  },
  upcoming: {
    img: {
      src: upcomingTaskEmptyState,
      width: 208,
      height: 260,
    },
    title: 'Plan ahead with ease!',
    description: 'Tasks added here will be due in the future. Click + to schedule a task.',
  },
  completed: {
    img: {
      src: completedTaskEmptyState,
      width: 231,
      height: 260,
    },
    title: 'You’ve been productive!',
    description: 'All the tasks you’ve completed will appear here. Keep up the great work!',
  },
  project: {
    img: {
      src: projectTaskEmptyState,
      width: 228,
      height: 260,
    },
    title: 'Let’s build something amazing!',
    description: 'Add tasks specific to this project. Click + to start planning.',
  },
};

export const PROJECT_COLORS = [
  {
    name: 'Slate',
    hex: '#64748b',
  },
  {
    name: 'Red',
    hex: '#ef4444',
  },
  {
    name: 'Orange',
    hex: '#f97316',
  },
  {
    name: 'Amber',
    hex: '#f59e0b',
  },
  {
    name: 'Yellow',
    hex: '#eab308',
  },
  {
    name: 'Lime',
    hex: '#84cc16',
  },
  {
    name: 'Green',
    hex: '#22c55e',
  },
  {
    name: 'Emerald',
    hex: '#10b981',
  },
  {
    name: 'Teal',
    hex: '#06b6d4',
  },
  {
    name: 'Cyan',
    hex: '#06b6d4',
  },
  {
    name: 'Sky',
    hex: '#0ea5e9',
  },
  {
    name: 'Blue',
    hex: '#06b6d4',
  },
  {
    name: 'Indigo',
    hex: '#6366f1',
  },
  {
    name: 'Violet',
    hex: '#8b5cf6',
  },
  {
    name: 'Purple',
    hex: '#a855f7',
  },
  {
    name: 'Fuchsia',
    hex: '#d946ef',
  },
  {
    name: 'Pink',
    hex: '#ec4899',
  },
  {
    name: 'Rose',
    hex: '#f43f5e',
  },
] as const;

export const DEFAULT_TASK_FORM_DATA: ITaskForm = {
  content: '',
  due_date: null,
  projectId: null,
};

export const DEFAULT_PROJECT_FORM_DATA: IProject = {
  id: null,
  name: DEFAULT_PROJECT_NAME,
  color_name: DEFAULT_PROJECT_COLOR_NAME,
  color_hex: DEFAULT_PROJECT_COLOR_HEX,
};
