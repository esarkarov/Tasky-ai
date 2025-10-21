import { taskService } from '@/services/task/task.service';
import type { TaskEntity } from '@/types/tasks.types';
import { errorResponse, successResponse } from '@/utils/response/response.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { taskAction } from './task.action';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getUpcomingTasks: vi.fn(),
    getTodayTasks: vi.fn(),
    getInboxTasks: vi.fn(),
    getCompletedTasks: vi.fn(),
    getInboxTaskCount: vi.fn(),
    getTodayTaskCount: vi.fn(),
    getTaskCounts: vi.fn(),
    createTasksForProject: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));
vi.mock('@/utils/response/response.utils', () => ({
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));

const mockedTaskService = vi.mocked(taskService);
const mockedErrorResponse = vi.mocked(errorResponse);
const mockedSuccessResponse = vi.mocked(successResponse);

describe('taskAction', () => {
  const MOCK_TASK_ID = '1';
  const BASE_URL = 'http://localhost';

  const createActionArgs = (request: Request) => ({
    request,
    params: {},
    context: {},
  });

  const createMockRequest = (method: string, body?: object) => {
    const options: RequestInit = { method };
    if (body) {
      options.body = JSON.stringify(body);
    }
    return new Request(BASE_URL, options);
  };

  const createMockTask = (overrides?: Partial<TaskEntity>): TaskEntity => ({
    id: MOCK_TASK_ID,
    content: 'Test task',
    due_date: new Date('2023-01-01'),
    completed: false,
    projectId: null,
    $id: MOCK_TASK_ID,
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $collectionId: 'tasks',
    $databaseId: 'default',
    $permissions: [],
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockedErrorResponse.mockReturnValue(new Response());
    mockedSuccessResponse.mockReturnValue(new Response());
  });

  describe('POST request', () => {
    it('should create task successfully', async () => {
      const taskData = { content: 'Test task' };
      const mockTask = createMockTask();
      const mockRequest = createMockRequest('POST', taskData);
      mockedTaskService.createTask.mockResolvedValue(mockTask);

      await taskAction(createActionArgs(mockRequest));

      expect(mockedTaskService.createTask).toHaveBeenCalledWith(taskData);
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Task created successfully', { task: mockTask }, 201);
    });

    it('should return error when content is missing', async () => {
      const taskData = { content: '' };
      const mockRequest = createMockRequest('POST', taskData);

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Task content is required', 400);
      expect(mockedTaskService.createTask).not.toHaveBeenCalled();
    });
  });

  describe('PUT request', () => {
    it('should update task successfully', async () => {
      const taskData = { id: MOCK_TASK_ID, content: 'Updated task' };
      const mockTask = createMockTask({ content: 'Updated task' });
      const mockRequest = createMockRequest('PUT', taskData);
      mockedTaskService.updateTask.mockResolvedValue(mockTask);

      await taskAction(createActionArgs(mockRequest));

      expect(mockedTaskService.updateTask).toHaveBeenCalledWith(MOCK_TASK_ID, { content: 'Updated task' });
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Task updated successfully', { task: mockTask });
    });

    it('should return error when ID is missing', async () => {
      const taskData = { content: 'Updated task' };
      const mockRequest = createMockRequest('PUT', taskData);

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Task ID is required', 400);
      expect(mockedTaskService.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('DELETE request', () => {
    it('should delete task successfully', async () => {
      const taskData = { id: MOCK_TASK_ID };
      const mockRequest = createMockRequest('DELETE', taskData);
      mockedTaskService.deleteTask.mockResolvedValue();

      await taskAction(createActionArgs(mockRequest));

      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith(MOCK_TASK_ID);
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Task deleted successfully');
    });

    it('should return error when ID is missing', async () => {
      const taskData = {};
      const mockRequest = createMockRequest('DELETE', taskData);

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Task ID is required', 400);
      expect(mockedTaskService.deleteTask).not.toHaveBeenCalled();
    });
  });

  describe('unsupported methods', () => {
    it('should return method not allowed for PATCH request', async () => {
      const mockRequest = createMockRequest('PATCH');

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Method not allowed', 405);
    });
  });

  describe('error handling', () => {
    it('should return error response when service throws Error', async () => {
      const taskData = { content: 'Test task' };
      const mockRequest = createMockRequest('POST', taskData);
      mockedTaskService.createTask.mockRejectedValue(new Error('Database error'));

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Database error', 500);
    });

    it('should return generic error for non-Error objects', async () => {
      const taskData = { content: 'Test task' };
      const mockRequest = createMockRequest('POST', taskData);
      mockedTaskService.createTask.mockRejectedValue('String error');

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Failed to process request', 500);
    });
  });
});
