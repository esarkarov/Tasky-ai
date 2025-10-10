import {
  completedTaskEmptyState,
  inboxTaskEmptyState,
  projectTaskEmptyState,
  todayTaskEmptyState,
  upcomingTaskEmptyState,
} from '@/assets';
import { EmptyStateVariant } from '@/types/shared.types';
import { EmptyStateContent } from '@/types/empty-state.types';
import { DEFAULT_EMPTY_STATE_IMAGE_HEIGHT } from './defaults';

const createEmptyState = (src: string, width: number, title: string, description: string): EmptyStateContent => ({
  img: {
    src,
    width,
    height: DEFAULT_EMPTY_STATE_IMAGE_HEIGHT,
  },
  title,
  description,
});

export const EMPTY_STATE_CONTENTS: Record<EmptyStateVariant, EmptyStateContent> = {
  today: createEmptyState(
    todayTaskEmptyState,
    226,
    'What do you need to get done today?',
    'By default, tasks added here will be due today. Click + to add a task.'
  ),
  inbox: createEmptyState(
    inboxTaskEmptyState,
    344,
    'What is on your mind?',
    "Capture tasks that don't have a specific category. Click + to add a task."
  ),
  upcoming: createEmptyState(
    upcomingTaskEmptyState,
    208,
    'Plan ahead with ease!',
    'Tasks added here will be due in the future. Click + to schedule a task.'
  ),
  completed: createEmptyState(
    completedTaskEmptyState,
    231,
    'You have been productive!',
    'All the tasks you have completed will appear here. Keep up the great work!'
  ),
  project: createEmptyState(
    projectTaskEmptyState,
    228,
    "Let's build something amazing!",
    'Add tasks specific to this project. Click + to start planning.'
  ),
};

export const PROJECT_TOAST_CONTENTS = {
  CREATE: {
    LOADING: 'Creating project...',
    SUCCESS: 'Project created!',
    ERROR: 'Error creating project!',
    ERROR_DESC: 'An error occurred while creating the project!',
  },
  UPDATE: {
    LOADING: 'Updating project...',
    SUCCESS: 'Project updated!',
    ERROR: 'Error updating project!',
    ERROR_DESC: 'An error occurred while updating the project!',
  },
  DELETE: {
    LOADING: 'Deleting project...',
    SUCCESS: 'Project deleted!',
    ERROR: 'Error deleting project!',
    ERROR_DESC: 'An error occurred while deleting the project!',
  },
} as const;

export const TASK_TOAST_CONTENTS = {
  CREATE: {
    LOADING: 'Creating task...',
    SUCCESS: 'Task created!',
    SUCCESS_DESC: 'The task has been successfully created!',
    ERROR: 'Error creating task!',
    ERROR_DESC: 'An error occurred while creating the task!',
  },
  UPDATE: {
    LOADING: 'Updating task...',
    SUCCESS: 'Task updated!',
    SUCCESS_DESC: 'The task has been successfully updated!',
    ERROR: 'Error updating task!',
    ERROR_DESC: 'An error occurred while updating the task!',
  },
  COMPLETE: {
    SUCCESS: 'Task completed!',
    UNCOMPLETE: 'Task marked as incomplete!',
    ERROR: 'Error updating task status!',
    ERROR_DESC: 'An error occurred while updating the task status!',
  },
  DELETE: {
    LOADING: 'Deleting task...',
    SUCCESS: 'Task deleted!',
    SUCCESS_DESC: 'The task has been successfully deleted!',
    ERROR: 'Error deleting task!',
    ERROR_DESC: 'An error occurred while deleting the task!',
  },
} as const;
