import { ROUTES } from '@/constants/routes';
import { TaskCounts } from '@/types/tasks.types';
import clsx, { ClassValue } from 'clsx';
import { isBefore, isToday, isTomorrow, startOfToday } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTaskDueDateColorClass(dueDate: Date | null, completed?: boolean): string | undefined {
  if (dueDate === null || completed === undefined) return;

  if (isBefore(dueDate, startOfToday()) && !completed) {
    return 'text-red-500';
  }
  if (isToday(dueDate)) {
    return 'text-emerald-500';
  }
  if (isTomorrow(dueDate) && !completed) {
    return 'text-amber-500';
  }
}

export const getBadgeCount = (href: string, taskCounts: TaskCounts): number | undefined => {
  switch (href) {
    case ROUTES.INBOX:
      return taskCounts?.inboxTasks;
    case ROUTES.TODAY:
      return taskCounts?.todayTasks;
    default:
      return undefined;
  }
};
