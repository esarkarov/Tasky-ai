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
    vi.clearAllMocks();
  });

  describe('executeWithToast', () => {
    const MOCK_TOAST_ID = 'toast-123';
    const DEFAULT_MESSAGES = {
      loading: 'Loading...',
      success: 'Success!',
      error: 'Error!',
      errorDescription: 'Something went wrong',
    };

    type ToastSetup = {
      operation: ReturnType<typeof vi.fn>;
      toastHandler: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      onSuccess?: ReturnType<typeof vi.fn>;
    };

    const setupToastMocks = (operationResult: 'success' | 'error'): ToastSetup => {
      const operation = vi.fn();
      const toastHandler = vi.fn();
      const update = vi.fn();
      const onSuccess = vi.fn();

      if (operationResult === 'success') {
        operation.mockResolvedValue('result');
      } else {
        operation.mockRejectedValue(new Error('Operation failed'));
      }

      toastHandler.mockReturnValue({ id: MOCK_TOAST_ID, update });

      return { operation, toastHandler, update, onSuccess };
    };

    it('should show loading toast, execute operation, and show success toast', async () => {
      const { operation, toastHandler, update, onSuccess } = setupToastMocks('success');
      const successDescription = 'Operation completed successfully';

      await executeWithToast(operation, toastHandler, DEFAULT_MESSAGES, successDescription, onSuccess);

      expect(toastHandler).toHaveBeenCalledWith({
        title: DEFAULT_MESSAGES.loading,
        duration: Infinity,
      });
      expect(operation).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith({
        id: MOCK_TOAST_ID,
        title: DEFAULT_MESSAGES.success,
        description: successDescription,
        duration: TIMING.TOAST_DURATION,
      });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should show error toast when operation fails', async () => {
      const { operation, toastHandler, update, onSuccess } = setupToastMocks('error');
      const successDescription = 'Operation completed successfully';

      await executeWithToast(operation, toastHandler, DEFAULT_MESSAGES, successDescription, onSuccess);

      expect(toastHandler).toHaveBeenCalledWith({
        title: DEFAULT_MESSAGES.loading,
        duration: Infinity,
      });
      expect(operation).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith({
        id: MOCK_TOAST_ID,
        title: DEFAULT_MESSAGES.error,
        description: DEFAULT_MESSAGES.errorDescription,
        duration: TIMING.TOAST_DURATION,
        variant: 'destructive',
      });
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should handle optional onSuccess callback', async () => {
      const { operation, toastHandler, update } = setupToastMocks('success');
      const successDescription = 'Operation completed successfully';

      await executeWithToast(operation, toastHandler, DEFAULT_MESSAGES, successDescription);

      expect(operation).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith({
        id: MOCK_TOAST_ID,
        title: DEFAULT_MESSAGES.success,
        description: successDescription,
        duration: TIMING.TOAST_DURATION,
      });
    });
  });

  describe('buildTaskSuccessDescription', () => {
    const DEFAULT_MAX_LENGTH = 50;
    const mockTruncateMessages = [
      {
        description: 'default max length',
        content: 'This is a very long task description that should be truncated',
        prefix: 'Task created',
        maxLength: undefined,
        expectedMaxLength: DEFAULT_MAX_LENGTH,
        truncatedContent: 'This is a very long task description tha...',
      },
      {
        description: 'custom max length',
        content: 'Short task',
        prefix: 'Task updated',
        maxLength: 20,
        expectedMaxLength: 20,
        truncatedContent: 'Short task',
      },
      {
        description: 'empty content',
        content: '',
        prefix: 'Task created',
        maxLength: undefined,
        expectedMaxLength: DEFAULT_MAX_LENGTH,
        truncatedContent: '',
      },
    ];

    const setupTruncateMock = (truncatedResult: string) => {
      mockedTruncateString.mockReturnValue(truncatedResult);
    };

    it.each(mockTruncateMessages)(
      'should build description with $description',
      ({ content, prefix, maxLength, expectedMaxLength, truncatedContent }) => {
        setupTruncateMock(truncatedContent);

        const result = maxLength
          ? buildTaskSuccessDescription(content, prefix, maxLength)
          : buildTaskSuccessDescription(content, prefix);

        expect(mockedTruncateString).toHaveBeenCalledWith(content, expectedMaxLength);
        expect(result).toBe(`${prefix} "${truncatedContent}"`);
      }
    );
  });

  describe('buildProjectSuccessDescription', () => {
    const mockProjectMessages = [
      {
        scenario: 'created project without AI tasks',
        projectName: 'My Awesome Project',
        truncatedName: 'My Awesome Project',
        hasAITasks: false,
        method: 'POST' as const,
        expected: 'The project My Awesome Project has been successfully created.',
      },
      {
        scenario: 'updated project with AI tasks',
        projectName: 'My Updated Project',
        truncatedName: 'My Updated Project',
        hasAITasks: true,
        method: 'PUT' as const,
        expected: 'The project My Updated Project and its tasks have been successfully updated.',
      },
      {
        scenario: 'long project name',
        projectName: 'This is a very long project name that should be truncated',
        truncatedName: 'This is a very long project na...',
        hasAITasks: false,
        method: 'POST' as const,
        expected: 'The project This is a very long project na... has been successfully created.',
      },
    ];
    const setupTruncateMock = (truncatedName: string) => {
      mockedTruncateString.mockReturnValue(truncatedName);
    };

    it.each(mockProjectMessages)(
      'should build description for $scenario',
      ({ projectName, truncatedName, hasAITasks, method, expected }) => {
        setupTruncateMock(truncatedName);

        const result = buildProjectSuccessDescription(projectName, hasAITasks, method);

        expect(mockedTruncateString).toHaveBeenCalledWith(projectName, MAX_TRUNCATE_LENGTH);
        expect(result).toBe(expected);
      }
    );
  });

  describe('buildSearchUrl', () => {
    const mockSearchQueries = [
      {
        description: 'simple search query',
        baseUrl: '/tasks',
        searchValue: 'my search query',
      },
      {
        description: 'special characters',
        baseUrl: '/search',
        searchValue: 'hello & world?',
        expectedEncoded: 'hello%20%26%20world%3F',
      },
    ];
    it('should return base URL when search value is empty', () => {
      const baseUrl = '/projects';
      const searchValue = '';

      const result = buildSearchUrl(baseUrl, searchValue);

      expect(result).toBe(baseUrl);
    });

    it.each(mockSearchQueries)('should build URL with $description', ({ baseUrl, searchValue, expectedEncoded }) => {
      const result = buildSearchUrl(baseUrl, searchValue);

      expect(result).toBe(`${baseUrl}?q=${encodeURIComponent(searchValue)}`);
      if (expectedEncoded) {
        expect(result).toContain(expectedEncoded);
      }
    });
  });
});
