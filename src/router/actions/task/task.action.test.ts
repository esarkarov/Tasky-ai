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
  const createActionArgs = (request: Request) => ({
    request,
    params: {},
    context: {},
  });

  const createMockTask = (overrides: Partial<TaskEntity> = {}): TaskEntity => ({
    id: '1',
    content: 'Test task',
    due_date: new Date('2023-01-01'),
    completed: false,
    projectId: null,
    $id: '1',
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $collectionId: 'tasks',
    $databaseId: 'default',
    $permissions: [],
    ...overrides,
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('POST request', () => {
    it('should create a task successfully', async () => {
      const mockTaskData = { content: 'Test task' };
      const mockTask = createMockTask();
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockTaskData),
      });

      mockedTaskService.createTask.mockResolvedValue(mockTask);
      mockedSuccessResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedTaskService.createTask).toHaveBeenCalledWith(mockTaskData);
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Task created successfully', { task: mockTask }, 201);
    });

    it('should return error when content is missing', async () => {
      const mockTaskData = { content: '' };
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockTaskData),
      });

      mockedErrorResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Task content is required', 400);
      expect(mockedTaskService.createTask).not.toHaveBeenCalled();
    });
  });

  describe('PUT request', () => {
    it('should update a task successfully', async () => {
      const mockTaskData = { id: '1', content: 'Updated task' };
      const mockTask = createMockTask({ content: 'Updated task' });
      const mockRequest = new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(mockTaskData),
      });

      mockedTaskService.updateTask.mockResolvedValue(mockTask);
      mockedSuccessResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedTaskService.updateTask).toHaveBeenCalledWith('1', { content: 'Updated task' });
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Task updated successfully', { task: mockTask });
    });

    it('should return error when ID is missing', async () => {
      const mockTaskData = { content: 'Updated task' };
      const mockRequest = new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(mockTaskData),
      });

      mockedErrorResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Task ID is required', 400);
      expect(mockedTaskService.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('DELETE request', () => {
    it('should delete a task successfully', async () => {
      const mockTaskData = { id: '1' };
      const mockRequest = new Request('http://localhost', {
        method: 'DELETE',
        body: JSON.stringify(mockTaskData),
      });

      mockedTaskService.deleteTask.mockResolvedValue();
      mockedSuccessResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith('1');
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Task deleted successfully');
    });

    it('should return error when ID is missing', async () => {
      const mockTaskData = {};
      const mockRequest = new Request('http://localhost', {
        method: 'DELETE',
        body: JSON.stringify(mockTaskData),
      });

      mockedErrorResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Task ID is required', 400);
      expect(mockedTaskService.deleteTask).not.toHaveBeenCalled();
    });
  });

  describe('Invalid method', () => {
    it('should return method not allowed for unsupported HTTP method', async () => {
      const mockRequest = new Request('http://localhost', {
        method: 'PATCH',
      });

      mockedErrorResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Method not allowed', 405);
    });
  });

  describe('Error handling', () => {
    it('should return error response when service throws error', async () => {
      const mockTaskData = { content: 'Test task' };
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockTaskData),
      });

      const mockError = new Error('Database error');
      mockedTaskService.createTask.mockRejectedValue(mockError);
      mockedErrorResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Database error', 500);
    });

    it('should return generic error message for non-Error objects', async () => {
      const mockTaskData = { content: 'Test task' };
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockTaskData),
      });

      mockedTaskService.createTask.mockRejectedValue('String error');
      mockedErrorResponse.mockReturnValue(new Response());

      await taskAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Failed to process request', 500);
    });
  });
});
