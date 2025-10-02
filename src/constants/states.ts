import {
  completedTaskEmptyState,
  inboxTaskEmptyState,
  projectTaskEmptyState,
  todayTaskEmptyState,
  upcomingTaskEmptyState,
} from '@/assets';
import { IEmptyStateContent } from '@/interfaces';
import { TEmptyStateType } from '@/types';

const EMPTY_STATE_IMAGE_HEIGHT = 260;

const createEmptyState = (src: string, width: number, title: string, description: string): IEmptyStateContent => ({
  img: {
    src,
    width,
    height: EMPTY_STATE_IMAGE_HEIGHT,
  },
  title,
  description,
});

export const EMPTY_STATES: Record<TEmptyStateType, IEmptyStateContent> = {
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
