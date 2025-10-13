import { TIMING } from '@/constants/timing';
import { MAX_TRUNCATE_LENGTH } from '@/constants/validation';
import {
  buildProjectSuccessDescription,
  buildSearchUrl,
  buildTaskSuccessDescription,
  executeWithToast,
} from '@/utils/operation/operation.utils';
import { truncateString } from '@/utils/text/text.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/timing', () => ({
  TIMING: {
    TOAST_DURATION: 5000,
  },
}));

vi.mock('@/constants/validation', () => ({
  MAX_TRUNCATE_LENGTH: 30,
}));

vi.mock('@/utils/text/text.utils', () => ({
  truncateString: vi.fn(),
}));

const mockedTruncateString = vi.mocked(truncateString);

describe('operation utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('executeWithToast', () => {
    it('should show success toast when operation succeeds', async () => {
      const mockOperation = vi.fn().mockResolvedValue('result');
      const mockToastHandler = vi.fn();
      const mockUpdate = vi.fn();
      const mockId = 'toast-123';
      const messages = {
        LOADING: 'Loading...',
        SUCCESS: 'Success!',
        ERROR: 'Error!',
        ERROR_DESC: 'Something went wrong',
      };
      const successDescription = 'Operation completed successfully';
      const onSuccess = vi.fn();

      mockToastHandler.mockReturnValue({ id: mockId, update: mockUpdate });

      await executeWithToast(mockOperation, mockToastHandler, messages, successDescription, onSuccess);

      expect(mockToastHandler).toHaveBeenCalledWith({
        title: messages.LOADING,
        duration: Infinity,
      });
      expect(mockOperation).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith({
        id: mockId,
        title: messages.SUCCESS,
        description: successDescription,
        duration: TIMING.TOAST_DURATION,
      });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should show error toast when operation fails', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Operation failed'));
      const mockToastHandler = vi.fn();
      const mockUpdate = vi.fn();
      const mockId = 'toast-123';
      const messages = {
        LOADING: 'Loading...',
        SUCCESS: 'Success!',
        ERROR: 'Error!',
        ERROR_DESC: 'Something went wrong',
      };
      const successDescription = 'Operation completed successfully';
      const onSuccess = vi.fn();

      mockToastHandler.mockReturnValue({ id: mockId, update: mockUpdate });

      await executeWithToast(mockOperation, mockToastHandler, messages, successDescription, onSuccess);

      expect(mockToastHandler).toHaveBeenCalledWith({
        title: messages.LOADING,
        duration: Infinity,
      });
      expect(mockOperation).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith({
        id: mockId,
        title: messages.ERROR,
        description: messages.ERROR_DESC,
        duration: TIMING.TOAST_DURATION,
        variant: 'destructive',
      });
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should not call onSuccess when not provided', async () => {
      const mockOperation = vi.fn().mockResolvedValue('result');
      const mockToastHandler = vi.fn();
      const mockUpdate = vi.fn();
      const mockId = 'toast-123';
      const messages = {
        LOADING: 'Loading...',
        SUCCESS: 'Success!',
        ERROR: 'Error!',
        ERROR_DESC: 'Something went wrong',
      };
      const successDescription = 'Operation completed successfully';

      mockToastHandler.mockReturnValue({ id: mockId, update: mockUpdate });

      await executeWithToast(mockOperation, mockToastHandler, messages, successDescription);

      expect(mockOperation).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith({
        id: mockId,
        title: messages.SUCCESS,
        description: successDescription,
        duration: TIMING.TOAST_DURATION,
      });
    });
  });

  describe('buildTaskSuccessDescription', () => {
    it('should build task success description with default max length', () => {
      const content = 'This is a very long task description that should be truncated';
      const prefix = 'Task created';
      const truncatedContent = 'This is a very long task description tha...';
      mockedTruncateString.mockReturnValue(truncatedContent);

      const result = buildTaskSuccessDescription(content, prefix);

      expect(mockedTruncateString).toHaveBeenCalledWith(content, 50);
      expect(result).toBe(`${prefix} "${truncatedContent}"`);
    });

    it('should build task success description with custom max length', () => {
      const content = 'Short task';
      const prefix = 'Task updated';
      const truncatedContent = 'Short task';
      mockedTruncateString.mockReturnValue(truncatedContent);

      const result = buildTaskSuccessDescription(content, prefix, 20);

      expect(mockedTruncateString).toHaveBeenCalledWith(content, 20);
      expect(result).toBe(`${prefix} "${truncatedContent}"`);
    });

    it('should handle empty task content', () => {
      const content = '';
      const prefix = 'Task created';
      const truncatedContent = '';
      mockedTruncateString.mockReturnValue(truncatedContent);

      const result = buildTaskSuccessDescription(content, prefix);

      expect(result).toBe(`${prefix} "${truncatedContent}"`);
    });
  });

  describe('buildProjectSuccessDescription', () => {
    it('should build project success description for created project without AI tasks', () => {
      const projectName = 'My Awesome Project';
      const truncatedName = 'My Awesome Project';
      mockedTruncateString.mockReturnValue(truncatedName);

      const result = buildProjectSuccessDescription(projectName, false, 'POST');

      expect(mockedTruncateString).toHaveBeenCalledWith(projectName, MAX_TRUNCATE_LENGTH);
      expect(result).toBe(`The project ${truncatedName} has been successfully created.`);
    });

    it('should build project success description for updated project with AI tasks', () => {
      const projectName = 'My Updated Project';
      const truncatedName = 'My Updated Project';
      mockedTruncateString.mockReturnValue(truncatedName);

      const result = buildProjectSuccessDescription(projectName, true, 'PUT');

      expect(result).toBe(`The project ${truncatedName} and its tasks have been successfully updated.`);
    });

    it('should build project success description for long project name', () => {
      const projectName = 'This is a very long project name that should be truncated';
      const truncatedName = 'This is a very long project na...';
      mockedTruncateString.mockReturnValue(truncatedName);

      const result = buildProjectSuccessDescription(projectName, false, 'POST');

      expect(mockedTruncateString).toHaveBeenCalledWith(projectName, MAX_TRUNCATE_LENGTH);
      expect(result).toBe(`The project ${truncatedName} has been successfully created.`);
    });
  });

  describe('buildSearchUrl', () => {
    it('should return base URL when search value is empty', () => {
      const baseUrl = '/projects';
      const searchValue = '';

      const result = buildSearchUrl(baseUrl, searchValue);

      expect(result).toBe(baseUrl);
    });

    it('should build search URL with encoded search value', () => {
      const baseUrl = '/tasks';
      const searchValue = 'my search query';

      const result = buildSearchUrl(baseUrl, searchValue);

      expect(result).toBe(`${baseUrl}?q=${encodeURIComponent(searchValue)}`);
    });

    it('should encode special characters in search value', () => {
      const baseUrl = '/search';
      const searchValue = 'hello & world?';

      const result = buildSearchUrl(baseUrl, searchValue);

      expect(result).toBe(`${baseUrl}?q=${encodeURIComponent(searchValue)}`);
      expect(result).toContain('hello%20%26%20world%3F');
    });
  });
});
