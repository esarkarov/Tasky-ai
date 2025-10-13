import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskQueries } from './task.queries';
import { Query } from 'appwrite';

vi.mock('appwrite', () => ({
  Query: {
    select: vi.fn(),
    equal: vi.fn(),
    isNull: vi.fn(),
    isNotNull: vi.fn(),
    greaterThanEqual: vi.fn(),
    lessThan: vi.fn(),
    and: vi.fn(),
    orderAsc: vi.fn(),
    orderDesc: vi.fn(),
    limit: vi.fn(),
  },
}));

const mockedQuery = vi.mocked(Query);

describe('taskQueries', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('selectIdOnly', () => {
    it('should return query to select only ID fields', () => {
      const mockSelectQuery = 'select-query';
      mockedQuery.select.mockReturnValue(mockSelectQuery);

      const result = taskQueries.selectIdOnly();

      expect(mockedQuery.select).toHaveBeenCalledWith(['$id']);
      expect(result).toBe(mockSelectQuery);
    });
  });

  describe('byUserId', () => {
    it('should return query to filter by user ID', () => {
      const userId = 'user-123';
      const mockEqualQuery = 'equal-user';
      mockedQuery.equal.mockReturnValue(mockEqualQuery);

      const result = taskQueries.byUserId(userId);

      expect(mockedQuery.equal).toHaveBeenCalledWith('userId', userId);
      expect(result).toBe(mockEqualQuery);
    });
  });

  describe('completed', () => {
    it('should return query to filter by completion status', () => {
      const isCompleted = true;
      const mockEqualQuery = 'equal-completed';
      mockedQuery.equal.mockReturnValue(mockEqualQuery);

      const result = taskQueries.completed(isCompleted);

      expect(mockedQuery.equal).toHaveBeenCalledWith('completed', isCompleted);
      expect(result).toBe(mockEqualQuery);
    });
  });

  describe('nullProject', () => {
    it('should return query to filter tasks with null projectId', () => {
      const mockIsNullQuery = 'is-null-project';
      mockedQuery.isNull.mockReturnValue(mockIsNullQuery);

      const result = taskQueries.nullProject();

      expect(mockedQuery.isNull).toHaveBeenCalledWith('projectId');
      expect(result).toBe(mockIsNullQuery);
    });
  });

  describe('notNullDueDate', () => {
    it('should return query to filter tasks with non-null due_date', () => {
      const mockIsNotNullQuery = 'is-not-null-due-date';
      mockedQuery.isNotNull.mockReturnValue(mockIsNotNullQuery);

      const result = taskQueries.notNullDueDate();

      expect(mockedQuery.isNotNull).toHaveBeenCalledWith('due_date');
      expect(result).toBe(mockIsNotNullQuery);
    });
  });

  describe('dueDateRange', () => {
    it('should return query to filter tasks within due date range', () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-02';
      const mockGreaterThanQuery = 'greater-than';
      const mockLessThanQuery = 'less-than';
      const mockAndQuery = 'and-query';

      mockedQuery.greaterThanEqual.mockReturnValue(mockGreaterThanQuery);
      mockedQuery.lessThan.mockReturnValue(mockLessThanQuery);
      mockedQuery.and.mockReturnValue(mockAndQuery);

      const result = taskQueries.dueDateRange(startDate, endDate);

      expect(mockedQuery.greaterThanEqual).toHaveBeenCalledWith('due_date', startDate);
      expect(mockedQuery.lessThan).toHaveBeenCalledWith('due_date', endDate);
      expect(mockedQuery.and).toHaveBeenCalledWith([mockGreaterThanQuery, mockLessThanQuery]);
      expect(result).toBe(mockAndQuery);
    });
  });

  describe('dueDateFrom', () => {
    it('should return query to filter tasks with due date from specified date', () => {
      const date = '2023-01-01';
      const mockGreaterThanQuery = 'greater-than-equal';
      mockedQuery.greaterThanEqual.mockReturnValue(mockGreaterThanQuery);

      const result = taskQueries.dueDateFrom(date);

      expect(mockedQuery.greaterThanEqual).toHaveBeenCalledWith('due_date', date);
      expect(result).toBe(mockGreaterThanQuery);
    });
  });

  describe('orderByDueDateAsc', () => {
    it('should return query to order by due date ascending', () => {
      const mockOrderQuery = 'order-asc';
      mockedQuery.orderAsc.mockReturnValue(mockOrderQuery);

      const result = taskQueries.orderByDueDateAsc();

      expect(mockedQuery.orderAsc).toHaveBeenCalledWith('due_date');
      expect(result).toBe(mockOrderQuery);
    });
  });

  describe('orderByUpdatedDesc', () => {
    it('should return query to order by updated date descending', () => {
      const mockOrderQuery = 'order-desc';
      mockedQuery.orderDesc.mockReturnValue(mockOrderQuery);

      const result = taskQueries.orderByUpdatedDesc();

      expect(mockedQuery.orderDesc).toHaveBeenCalledWith('$updatedAt');
      expect(result).toBe(mockOrderQuery);
    });
  });

  describe('limit', () => {
    it('should return query to limit results', () => {
      const count = 10;
      const mockLimitQuery = 'limit-query';
      mockedQuery.limit.mockReturnValue(mockLimitQuery);

      const result = taskQueries.limit(count);

      expect(mockedQuery.limit).toHaveBeenCalledWith(count);
      expect(result).toBe(mockLimitQuery);
    });
  });

  describe('todayTasks', () => {
    it('should return array of queries for today tasks', () => {
      const userId = 'user-123';
      const todayDate = '2023-01-01';
      const tomorrowDate = '2023-01-02';

      const mockByUserId = 'by-user';
      const mockCompleted = 'completed-false';
      const mockDueDateRange = 'due-date-range';

      mockedQuery.equal.mockReturnValueOnce(mockByUserId).mockReturnValueOnce(mockCompleted);
      mockedQuery.and.mockReturnValue(mockDueDateRange);

      const result = taskQueries.todayTasks(todayDate, tomorrowDate, userId);

      expect(result).toEqual([mockByUserId, mockCompleted, mockDueDateRange]);
      expect(mockedQuery.equal).toHaveBeenNthCalledWith(1, 'userId', userId);
      expect(mockedQuery.equal).toHaveBeenNthCalledWith(2, 'completed', false);
    });
  });

  describe('todayCount', () => {
    it('should return array of queries for today task count', () => {
      const userId = 'user-123';
      const todayDate = '2023-01-01';
      const tomorrowDate = '2023-01-02';

      const mockSelectId = 'select-id';
      const mockByUserId = 'by-user';
      const mockCompleted = 'completed-false';
      const mockDueDateRange = 'due-date-range';
      const mockLimit = 'limit-1';

      mockedQuery.select.mockReturnValue(mockSelectId);
      mockedQuery.equal.mockReturnValueOnce(mockByUserId).mockReturnValueOnce(mockCompleted);
      mockedQuery.and.mockReturnValue(mockDueDateRange);
      mockedQuery.limit.mockReturnValue(mockLimit);

      const result = taskQueries.todayCount(todayDate, tomorrowDate, userId);

      expect(result).toEqual([mockSelectId, mockByUserId, mockCompleted, mockDueDateRange, mockLimit]);
      expect(mockedQuery.limit).toHaveBeenCalledWith(1);
    });
  });

  describe('inboxTasks', () => {
    it('should return array of queries for inbox tasks', () => {
      const userId = 'user-123';

      const mockByUserId = 'by-user';
      const mockCompleted = 'completed-false';
      const mockNullProject = 'null-project';

      mockedQuery.equal.mockReturnValueOnce(mockByUserId).mockReturnValueOnce(mockCompleted);
      mockedQuery.isNull.mockReturnValue(mockNullProject);

      const result = taskQueries.inboxTasks(userId);

      expect(result).toEqual([mockByUserId, mockCompleted, mockNullProject]);
      expect(mockedQuery.equal).toHaveBeenNthCalledWith(1, 'userId', userId);
      expect(mockedQuery.equal).toHaveBeenNthCalledWith(2, 'completed', false);
      expect(mockedQuery.isNull).toHaveBeenCalledWith('projectId');
    });
  });

  describe('inboxCount', () => {
    it('should return array of queries for inbox task count', () => {
      const userId = 'user-123';

      const mockSelectId = 'select-id';
      const mockByUserId = 'by-user';
      const mockCompleted = 'completed-false';
      const mockNullProject = 'null-project';
      const mockLimit = 'limit-1';

      mockedQuery.select.mockReturnValue(mockSelectId);
      mockedQuery.equal.mockReturnValueOnce(mockByUserId).mockReturnValueOnce(mockCompleted);
      mockedQuery.isNull.mockReturnValue(mockNullProject);
      mockedQuery.limit.mockReturnValue(mockLimit);

      const result = taskQueries.inboxCount(userId);

      expect(result).toEqual([mockSelectId, mockByUserId, mockCompleted, mockNullProject, mockLimit]);
    });
  });

  describe('completedTasks', () => {
    it('should return array of queries for completed tasks', () => {
      const userId = 'user-123';

      const mockByUserId = 'by-user';
      const mockCompleted = 'completed-true';
      const mockOrderDesc = 'order-desc';

      mockedQuery.equal.mockReturnValueOnce(mockByUserId).mockReturnValueOnce(mockCompleted);
      mockedQuery.orderDesc.mockReturnValue(mockOrderDesc);

      const result = taskQueries.completedTasks(userId);

      expect(result).toEqual([mockByUserId, mockCompleted, mockOrderDesc]);
      expect(mockedQuery.equal).toHaveBeenNthCalledWith(1, 'userId', userId);
      expect(mockedQuery.equal).toHaveBeenNthCalledWith(2, 'completed', true);
      expect(mockedQuery.orderDesc).toHaveBeenCalledWith('$updatedAt');
    });
  });

  describe('upcomingTasks', () => {
    it('should return array of queries for upcoming tasks', () => {
      const userId = 'user-123';
      const todayDate = '2023-01-01';

      const mockByUserId = 'by-user';
      const mockCompleted = 'completed-false';
      const mockNotNullDueDate = 'not-null-due-date';
      const mockDueDateFrom = 'due-date-from';
      const mockOrderAsc = 'order-asc';

      mockedQuery.equal.mockReturnValueOnce(mockByUserId).mockReturnValueOnce(mockCompleted);
      mockedQuery.isNotNull.mockReturnValue(mockNotNullDueDate);
      mockedQuery.greaterThanEqual.mockReturnValue(mockDueDateFrom);
      mockedQuery.orderAsc.mockReturnValue(mockOrderAsc);

      const result = taskQueries.upcomingTasks(todayDate, userId);

      expect(result).toEqual([mockByUserId, mockCompleted, mockNotNullDueDate, mockDueDateFrom, mockOrderAsc]);
      expect(mockedQuery.greaterThanEqual).toHaveBeenCalledWith('due_date', todayDate);
      expect(mockedQuery.orderAsc).toHaveBeenCalledWith('due_date');
    });
  });
});
