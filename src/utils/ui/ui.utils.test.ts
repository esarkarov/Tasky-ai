import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, getTaskDueDateColorClass, getBadgeCount } from './ui.utils';
import { ROUTES } from '@/constants/routes';
import { TaskCounts } from '@/types/tasks.types';
import clsx from 'clsx';
import { isBefore, isToday, isTomorrow, startOfToday } from 'date-fns';
import { twMerge } from 'tailwind-merge';

vi.mock('clsx');
vi.mock('@/constants/routes', () => ({
  ROUTES: {
    INBOX: '/inbox',
    TODAY: '/today',
    UPCOMING: '/upcoming',
  },
}));
vi.mock('tailwind-merge', () => ({
  twMerge: vi.fn(),
}));
vi.mock('date-fns', () => ({
  isBefore: vi.fn(),
  isToday: vi.fn(),
  isTomorrow: vi.fn(),
  startOfToday: vi.fn(),
}));

const mockedClsx = vi.mocked(clsx);
const mockedTwMerge = vi.mocked(twMerge);
const mockedIsBefore = vi.mocked(isBefore);
const mockedIsToday = vi.mocked(isToday);
const mockedIsTomorrow = vi.mocked(isTomorrow);
const mockedStartOfToday = vi.mocked(startOfToday);

describe('ui utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('cn', () => {
    it('should combine class names using clsx and twMerge', () => {
      const classNames = ['class1', 'class2'];
      const mockClsxResult = 'class1 class2';
      const mockTwMergeResult = 'merged-class1 merged-class2';

      mockedClsx.mockReturnValue(mockClsxResult);
      mockedTwMerge.mockReturnValue(mockTwMergeResult);

      const result = cn(...classNames);

      expect(mockedClsx).toHaveBeenCalledWith(classNames);
      expect(mockedTwMerge).toHaveBeenCalledWith(mockClsxResult);
      expect(result).toBe(mockTwMergeResult);
    });
  });

  describe('getTaskDueDateColorClass', () => {
    beforeEach(() => {
      const mockToday = new Date('2023-01-15');
      vi.setSystemTime(mockToday);
      mockedStartOfToday.mockReturnValue(mockToday);
    });

    it('should return undefined when dueDate is null', () => {
      const dueDate = null;
      const completed = false;

      const result = getTaskDueDateColorClass(dueDate, completed);

      expect(result).toBeUndefined();
    });

    it('should return undefined when completed is undefined', () => {
      const dueDate = new Date('2023-01-14');
      const completed = undefined;

      const result = getTaskDueDateColorClass(dueDate, completed);

      expect(result).toBeUndefined();
    });

    it('should return red color for overdue incomplete tasks', () => {
      const dueDate = new Date('2023-01-14');
      const completed = false;
      mockedIsBefore.mockReturnValue(true);
      mockedIsToday.mockReturnValue(false);
      mockedIsTomorrow.mockReturnValue(false);

      const result = getTaskDueDateColorClass(dueDate, completed);

      expect(mockedIsBefore).toHaveBeenCalledWith(dueDate, expect.any(Date));
      expect(result).toBe('text-red-500');
    });

    it('should return emerald color for tasks due today', () => {
      const dueDate = new Date('2023-01-15');
      const completed = false;
      mockedIsBefore.mockReturnValue(false);
      mockedIsToday.mockReturnValue(true);
      mockedIsTomorrow.mockReturnValue(false);

      const result = getTaskDueDateColorClass(dueDate, completed);

      expect(mockedIsToday).toHaveBeenCalledWith(dueDate);
      expect(result).toBe('text-emerald-500');
    });

    it('should return amber color for tasks due tomorrow and incomplete', () => {
      const dueDate = new Date('2023-01-16');
      const completed = false;
      mockedIsBefore.mockReturnValue(false);
      mockedIsToday.mockReturnValue(false);
      mockedIsTomorrow.mockReturnValue(true);

      const result = getTaskDueDateColorClass(dueDate, completed);

      expect(mockedIsTomorrow).toHaveBeenCalledWith(dueDate);
      expect(result).toBe('text-amber-500');
    });

    it('should not return amber color for completed tasks due tomorrow', () => {
      const dueDate = new Date('2023-01-16');
      const completed = true;
      mockedIsBefore.mockReturnValue(false);
      mockedIsToday.mockReturnValue(false);
      mockedIsTomorrow.mockReturnValue(true);

      const result = getTaskDueDateColorClass(dueDate, completed);

      expect(result).toBeUndefined();
    });

    it('should return undefined for future tasks beyond tomorrow', () => {
      const dueDate = new Date('2023-01-17');
      const completed = false;
      mockedIsBefore.mockReturnValue(false);
      mockedIsToday.mockReturnValue(false);
      mockedIsTomorrow.mockReturnValue(false);

      const result = getTaskDueDateColorClass(dueDate, completed);

      expect(result).toBeUndefined();
    });
  });

  describe('getBadgeCount', () => {
    it('should return inbox tasks count for inbox route', () => {
      const href = ROUTES.INBOX;
      const taskCounts: TaskCounts = {
        inboxTasks: 5,
        todayTasks: 3,
      };

      const result = getBadgeCount(href, taskCounts);

      expect(result).toBe(5);
    });

    it('should return today tasks count for today route', () => {
      const href = ROUTES.TODAY;
      const taskCounts: TaskCounts = {
        inboxTasks: 5,
        todayTasks: 3,
      };

      const result = getBadgeCount(href, taskCounts);

      expect(result).toBe(3);
    });

    it('should return undefined for other routes', () => {
      const href = ROUTES.UPCOMING;
      const taskCounts: TaskCounts = {
        inboxTasks: 5,
        todayTasks: 3,
      };

      const result = getBadgeCount(href, taskCounts);

      expect(result).toBeUndefined();
    });

    it('should handle zero counts correctly', () => {
      const href = ROUTES.INBOX;
      const taskCounts: TaskCounts = {
        inboxTasks: 0,
        todayTasks: 0,
      };

      const result = getBadgeCount(href, taskCounts);

      expect(result).toBe(0);
    });
  });
});
