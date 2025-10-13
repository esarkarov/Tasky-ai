import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectQueries } from './project.queries';
import { Query } from 'appwrite';

vi.mock('appwrite', () => ({
  Query: {
    select: vi.fn(),
    equal: vi.fn(),
    contains: vi.fn(),
    orderDesc: vi.fn(),
    limit: vi.fn(),
  },
}));

const mockedQuery = vi.mocked(Query);

describe('projectQueries', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('selectListFields', () => {
    it('should return query to select project list fields', () => {
      const mockSelectQuery = 'select-query';
      mockedQuery.select.mockReturnValue(mockSelectQuery);

      const result = projectQueries.selectListFields();

      expect(mockedQuery.select).toHaveBeenCalledWith(['$id', 'name', 'color_name', 'color_hex', '$createdAt']);
      expect(result).toBe(mockSelectQuery);
    });
  });

  describe('byUserId', () => {
    it('should return query to filter by user ID', () => {
      const userId = 'user-123';
      const mockEqualQuery = 'equal-user';
      mockedQuery.equal.mockReturnValue(mockEqualQuery);

      const result = projectQueries.byUserId(userId);

      expect(mockedQuery.equal).toHaveBeenCalledWith('userId', userId);
      expect(result).toBe(mockEqualQuery);
    });
  });

  describe('searchByName', () => {
    it('should return query to search by project name', () => {
      const searchTerm = 'test project';
      const mockContainsQuery = 'contains-query';
      mockedQuery.contains.mockReturnValue(mockContainsQuery);

      const result = projectQueries.searchByName(searchTerm);

      expect(mockedQuery.contains).toHaveBeenCalledWith('name', searchTerm);
      expect(result).toBe(mockContainsQuery);
    });
  });

  describe('orderByCreatedDesc', () => {
    it('should return query to order by creation date descending', () => {
      const mockOrderQuery = 'order-desc';
      mockedQuery.orderDesc.mockReturnValue(mockOrderQuery);

      const result = projectQueries.orderByCreatedDesc();

      expect(mockedQuery.orderDesc).toHaveBeenCalledWith('$createdAt');
      expect(result).toBe(mockOrderQuery);
    });
  });

  describe('limit', () => {
    it('should return query to limit results', () => {
      const count = 5;
      const mockLimitQuery = 'limit-query';
      mockedQuery.limit.mockReturnValue(mockLimitQuery);

      const result = projectQueries.limit(count);

      expect(mockedQuery.limit).toHaveBeenCalledWith(count);
      expect(result).toBe(mockLimitQuery);
    });
  });

  describe('userProjects', () => {
    it('should return base queries for user projects without options', () => {
      const userId = 'user-123';
      const mockSelect = 'select-fields';
      const mockByUser = 'by-user';
      const mockOrder = 'order-desc';

      mockedQuery.select.mockReturnValue(mockSelect);
      mockedQuery.equal.mockReturnValue(mockByUser);
      mockedQuery.orderDesc.mockReturnValue(mockOrder);

      const result = projectQueries.userProjects(userId);

      expect(result).toEqual([mockSelect, mockByUser, mockOrder]);
      expect(mockedQuery.select).toHaveBeenCalledWith(['$id', 'name', 'color_name', 'color_hex', '$createdAt']);
      expect(mockedQuery.equal).toHaveBeenCalledWith('userId', userId);
      expect(mockedQuery.orderDesc).toHaveBeenCalledWith('$createdAt');
    });

    it('should include search query when search option is provided', () => {
      const userId = 'user-123';
      const searchTerm = 'test';
      const mockSelect = 'select-fields';
      const mockByUser = 'by-user';
      const mockOrder = 'order-desc';
      const mockSearch = 'search-query';

      mockedQuery.select.mockReturnValue(mockSelect);
      mockedQuery.equal.mockReturnValue(mockByUser);
      mockedQuery.orderDesc.mockReturnValue(mockOrder);
      mockedQuery.contains.mockReturnValue(mockSearch);

      const result = projectQueries.userProjects(userId, { search: searchTerm });

      expect(result).toEqual([mockSelect, mockByUser, mockOrder, mockSearch]);
      expect(mockedQuery.contains).toHaveBeenCalledWith('name', searchTerm);
    });

    it('should include limit query when limit option is provided', () => {
      const userId = 'user-123';
      const limit = 10;
      const mockSelect = 'select-fields';
      const mockByUser = 'by-user';
      const mockOrder = 'order-desc';
      const mockLimit = 'limit-query';

      mockedQuery.select.mockReturnValue(mockSelect);
      mockedQuery.equal.mockReturnValue(mockByUser);
      mockedQuery.orderDesc.mockReturnValue(mockOrder);
      mockedQuery.limit.mockReturnValue(mockLimit);

      const result = projectQueries.userProjects(userId, { limit });

      expect(result).toEqual([mockSelect, mockByUser, mockOrder, mockLimit]);
      expect(mockedQuery.limit).toHaveBeenCalledWith(limit);
    });

    it('should include both search and limit queries when both options are provided', () => {
      const userId = 'user-123';
      const searchTerm = 'test';
      const limit = 5;
      const mockSelect = 'select-fields';
      const mockByUser = 'by-user';
      const mockOrder = 'order-desc';
      const mockSearch = 'search-query';
      const mockLimit = 'limit-query';

      mockedQuery.select.mockReturnValue(mockSelect);
      mockedQuery.equal.mockReturnValue(mockByUser);
      mockedQuery.orderDesc.mockReturnValue(mockOrder);
      mockedQuery.contains.mockReturnValue(mockSearch);
      mockedQuery.limit.mockReturnValue(mockLimit);

      const result = projectQueries.userProjects(userId, { search: searchTerm, limit });

      expect(result).toEqual([mockSelect, mockByUser, mockOrder, mockSearch, mockLimit]);
      expect(mockedQuery.contains).toHaveBeenCalledWith('name', searchTerm);
      expect(mockedQuery.limit).toHaveBeenCalledWith(limit);
    });

    it('should not include search query when search term is empty string', () => {
      const userId = 'user-123';
      const mockSelect = 'select-fields';
      const mockByUser = 'by-user';
      const mockOrder = 'order-desc';

      mockedQuery.select.mockReturnValue(mockSelect);
      mockedQuery.equal.mockReturnValue(mockByUser);
      mockedQuery.orderDesc.mockReturnValue(mockOrder);

      const result = projectQueries.userProjects(userId, { search: '' });

      expect(result).toEqual([mockSelect, mockByUser, mockOrder]);
      expect(mockedQuery.contains).not.toHaveBeenCalled();
    });
  });
});
