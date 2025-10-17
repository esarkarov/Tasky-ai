import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksUpcomingLoader } from './tasks-upcoming.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksResponse } from '@/types/tasks.types';
import type { TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service');

const mockedTaskService = vi.mocked(taskService);

describe('tasksUpcomingLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createLoaderArgs = () => ({
    request: new Request('http://localhost'),
    params: {},
    context: {},
  });

  describe('when upcoming tasks exist', () => {
    it('should return upcoming tasks', async () => {
      const mockTasks: TasksResponse = {
        total: 2,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Upcoming task 1',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2025-12-12T00:00:00.000Z',
            $updatedAt: '2025-12-12T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
          {
            id: '2',
            $id: 'task-456',
            content: 'Upcoming task 2',
            due_date: null,
            completed: true,
            projectId: null,
            $createdAt: '2025-12-13T00:00:00.000Z',
            $updatedAt: '2025-11-14T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });

    it('should return tasks with future due dates', async () => {
      const futureDate = new Date('2025-12-25');
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Task with future due date',
            due_date: futureDate,
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

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].due_date).toEqual(futureDate);
    });

    it('should return tasks with project assignments', async () => {
      const mockTasks: TasksResponse = {
        total: 1,
        documents: [
          {
            id: '1',
            $id: 'task-123',
            content: 'Project task upcoming',
            due_date: null,
            completed: false,
            projectId: {
              $id: 'project-1',
              userId: 'user-412',
              color_name: 'red',
              color_hex: '#FF0000',
              name: 'Future Project',
              $createdAt: '2023-01-01T00:00:00.000Z',
              $updatedAt: '2023-01-01T00:00:00.000Z',
              $collectionId: 'projects',
              $databaseId: 'default',
              $permissions: [],
              tasks: [],
            },
            $createdAt: '2025-12-15T00:00:00.000Z',
            $updatedAt: '2025-12-15T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].projectId).toBeDefined();
      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });
  });

  describe('when no upcoming tasks exist', () => {
    it('should return empty tasks array', async () => {
      const mockTasks: TasksResponse = {
        total: 0,
        documents: [],
      };

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should propagate any service errors', async () => {
      const mockError = new Error('Service failed');
      mockedTaskService.getUpcomingTasks.mockRejectedValue(mockError);

      await expect(tasksUpcomingLoader(createLoaderArgs())).rejects.toThrow(mockError);
      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
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
            content: 'Test upcoming task',
            due_date: null,
            completed: false,
            projectId: null,
            $createdAt: '2025-12-15T00:00:00.000Z',
            $updatedAt: '2025-12-15T00:00:00.000Z',
            $collectionId: 'tasks',
            $databaseId: 'default',
            $permissions: [],
          },
        ],
      };

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total');
      expect(result.tasks).toHaveProperty('documents');
      expect(result.tasks.total).toBe(1);
      expect(result.tasks.documents).toHaveLength(1);
    });
  });
});
