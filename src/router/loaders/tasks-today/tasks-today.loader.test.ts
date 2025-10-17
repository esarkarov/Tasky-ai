import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksTodayLoader } from './tasks-today.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksResponse } from '@/types/tasks.types';
import type { TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service');

const mockedTaskService = vi.mocked(taskService);

describe('tasksTodayLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createLoaderArgs = () => ({
    request: new Request('http://localhost'),
    params: {},
    context: {},
  });

  describe('when today tasks exist', () => {
    it('should return today tasks', async () => {
      const mockTasks: TasksResponse = {
        total: 2,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Today task 1',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2025-10-15T00:00:00.000Z',
            $updatedAt: '2025-10-15T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
          {
            id: '2',
            $id: 'task-456',
            content: 'Today task 2',
            due_date: null,
            completed: true,
            projectId: null,
            $createdAt: '2025-10-15T00:00:00.000Z',
            $updatedAt: '2025-10-15T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getTodayTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });

    it('should return tasks with today due dates', async () => {
      const today = new Date();
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Task due today',
            due_date: today,
            completed: false,
            projectId: null,
            $createdAt: '2025-10-15T00:00:00.000Z',
            $updatedAt: '2025-10-15T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getTodayTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].due_date).toEqual(today);
    });

    it('should return tasks with project assignments', async () => {
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Project task due today',
            due_date: null,
            completed: false,
            projectId: {
              $id: 'project-1',
              userId: 'user-456',
              color_name: 'red',
              color_hex: '#FF0000',
              name: 'Work Project',
              $createdAt: '2023-01-01T00:00:00.000Z',
              $updatedAt: '2023-01-01T00:00:00.000Z',
              $collectionId: 'projects',
              $databaseId: 'default',
              $permissions: [],
              tasks: [],
            },
            $createdAt: '2025-10-15T00:00:00.000Z',
            $updatedAt: '2025-10-15T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getTodayTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].projectId).toBeDefined();
      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });
  });

  describe('when no today tasks exist', () => {
    it('should return empty tasks array', async () => {
      const mockTasks: TasksResponse = {
        total: 0,
        documents: [],
      };

      mockedTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getTodayTasks).toHaveBeenCalledOnce();
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should propagate any service errors', async () => {
      mockedTaskService.getTodayTasks.mockRejectedValue(new Error('Service failed'));

      await expect(tasksTodayLoader(createLoaderArgs())).rejects.toThrow('Service failed');
      expect(mockedTaskService.getTodayTasks).toHaveBeenCalledOnce();
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
            content: 'Test today task',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2025-10-15T00:00:00.000Z',
            $updatedAt: '2025-10-15T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total');
      expect(result.tasks).toHaveProperty('documents');
      expect(result.tasks.total).toBe(1);
      expect(result.tasks.documents).toHaveLength(1);
    });
  });
});
