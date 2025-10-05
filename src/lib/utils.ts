import { env } from '@/config/env';
import { ROUTES } from '@/constants/routes';
import { WEEKDAYS } from '@/constants/weekdays';
import { ITaskCounts } from '@/types/task.types';
import { clsx, type ClassValue } from 'clsx';
import { format, formatRelative, isBefore, isSameYear, isToday, isTomorrow, startOfToday } from 'date-fns';
import { redirect } from 'react-router';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

export function formatCustomDate(date: string | number | Date): string {
  const today = new Date();

  const relativeDay = toTitleCase(formatRelative(date, today).split(' at ')[0]);

  if (WEEKDAYS.includes(relativeDay)) {
    return relativeDay;
  }

  if (isSameYear(date, today)) {
    return format(date, 'dd MMM');
  } else {
    return format(date, 'dd MMM yyyy');
  }
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

export const getBadgeCount = (href: string, taskCounts: ITaskCounts): number | undefined => {
  switch (href) {
    case ROUTES.INBOX:
      return taskCounts?.inboxTasks;
    case ROUTES.TODAY:
      return taskCounts?.todayTasks;
    default:
      return undefined;
  }
};

export const generateContents = (prompt: string): string => {
  const result = `
      Generate and return a list of tasks based on the provided prompt and the given JSON schema.

      Prompt: ${prompt}

      Task Schema:
      {
        content: string; // Description of the task
        due_date: Date | null; // Due date of the task, or null if no specific due date is provided
      }

      Requirements:
      1. Ensure tasks align with the provided prompt.
      2. Set the 'due_date' relative to today's date: ${new Date()}.
      3. Return an array of tasks matching the schema.

      Output: Array<Task>
    `;

  return result;
};

export function generateID(): string {
  return Math.random().toString(36).slice(8) + Date.now().toString(36);
}

export function getUserId(): string {
  const clerkUserId = sessionStorage.getItem(env.clerkUserStorageKey);

  if (!clerkUserId) {
    redirect(ROUTES.AUTH_SYNC);
    return '';
  }

  return clerkUserId;
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength - 1)}...`;
  }

  return str;
}
