import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksInboxLoader } from './tasks-inbox.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksResponse } from '@/types/tasks.types';
import type { TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service');

const mockedTaskService = vi.mocked(taskService);

describe('tasksInboxLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createLoaderArgs = () => ({
    request: new Request('http://localhost'),
    params: {},
    context: {},
  });

  describe('when inbox tasks exist', () => {
    it('should return inbox tasks', async () => {
      const mockTasks: TasksResponse = {
        total: 2,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Inbox task 1',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
          {
            id: '2',
            $id: 'task-456',
            content: 'Inbox task 2',
            due_date: null,
            completed: true,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });

    it('should return tasks with mixed completion status', async () => {
      const mockTasks: TasksResponse = {
        total: 3,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Pending task',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
          {
            id: '2',
            $id: 'task-456',
            content: 'Completed task',
            due_date: null,
            completed: true,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
          {
            id: '3',
            $id: 'task-789',
            content: 'Another pending task',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result.tasks.total).toBe(3);
      expect(result.tasks.documents).toHaveLength(3);
    });

    it('should return tasks with due dates', async () => {
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Task with due date',
            due_date: new Date('2023-12-31'),
            completed: false,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].due_date).toBeInstanceOf(Date);
    });
  });

  describe('when no inbox tasks exist', () => {
    it('should return empty tasks array', async () => {
      const mockTasks: TasksResponse = {
        total: 0,
        documents: [],
      };

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors', async () => {
      mockedTaskService.getInboxTasks.mockRejectedValue(new Error('Service error'));

      await expect(tasksInboxLoader(createLoaderArgs())).rejects.toThrow('Service error');
      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
    });
  });

  describe('data structure validation', () => {
    it('should return correct TasksLoaderData structure', async () => {
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Test inbox task',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total');
      expect(result.tasks).toHaveProperty('documents');
      expect(result.tasks.total).toBe(1);
      expect(result.tasks.documents).toHaveLength(1);
      expect(result.tasks.documents[0].projectId).toBeNull();
    });

    it('should ensure all returned tasks are inbox tasks (no project)', async () => {
      const mockTasks: TasksResponse = {
        total: 2,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Inbox task 1',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
          {
            id: '2',
            $id: 'task-456',
            content: 'Inbox task 2',
            due_date: null,
            completed: true,
            projectId: null,
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents.every((task) => task.projectId === null)).toBe(true);
    });
  });

  describe('loader function properties', () => {
    it('should not use request parameters', async () => {
      const mockTasks: TasksResponse = {
        total: 0,
        documents: [],
      };

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });
  });
});
