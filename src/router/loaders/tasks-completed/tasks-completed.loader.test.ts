import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksCompletedLoader } from './tasks-completed.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksResponse } from '@/types/tasks.types';
import type { TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service');

const mockedTaskService = vi.mocked(taskService);

describe('tasksCompletedLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createLoaderArgs = () => ({
    request: new Request('http://localhost'),
    params: {},
    context: {},
  });

  describe('when completed tasks exist', () => {
    it('should return completed tasks', async () => {
      const mockTasks: TasksResponse = {
        total: 2,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Completed task 1',
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
            id: '2',
            $id: 'task-456',
            content: 'Completed task 2',
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

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });

    it('should return tasks with project references', async () => {
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Completed task with project',
            due_date: null,
            completed: true,
            projectId: {
              $id: 'project-1',
              userId: 'user-123',
              name: 'Test Project',
              color_name: 'orange',
              color_hex: '#FFA500',
              $createdAt: '2023-01-01T00:00:00.000Z',
              $updatedAt: '2023-01-01T00:00:00.000Z',
              $collectionId: 'projects',
              $databaseId: 'default',
              $permissions: [],
              tasks: [],
            },
            $createdAt: '2023-01-01T00:00:00.000Z',
            $updatedAt: '2023-01-01T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].projectId).toBeDefined();
      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });

    it('should return tasks with due dates', async () => {
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Completed task with due date',
            due_date: new Date('2023-12-31'),
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

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].due_date).toBeInstanceOf(Date);
    });
  });

  describe('when no completed tasks exist', () => {
    it('should return empty tasks array', async () => {
      const mockTasks: TasksResponse = {
        total: 0,
        documents: [],
      };

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors', async () => {
      mockedTaskService.getCompletedTasks.mockRejectedValue(new Error('Service error'));

      await expect(tasksCompletedLoader(createLoaderArgs())).rejects.toThrow('Service error');
      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
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
            content: 'Test completed task',
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

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total');
      expect(result.tasks).toHaveProperty('documents');
      expect(result.tasks.total).toBe(1);
      expect(result.tasks.documents).toHaveLength(1);
      expect(result.tasks.documents[0].completed).toBe(true);
    });

    it('should ensure all returned tasks are completed', async () => {
      const mockTasks: TasksResponse = {
        total: 2,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Completed task 1',
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
            id: '2',
            $id: 'task-456',
            content: 'Completed task 2',
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

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents.every((task) => task.completed === true)).toBe(true);
    });
  });
});
