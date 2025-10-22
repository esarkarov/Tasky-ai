import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksUpcomingLoader } from './tasks-upcoming.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksResponse } from '@/types/tasks.types';
import type { TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getUpcomingTasks: vi.fn(),
  },
}));

const mockedTaskService = vi.mocked(taskService);

const createLoaderArgs = () => ({
  request: new Request('http://localhost'),
  params: {},
  context: {},
});

const createMockTasks = (overrides?: Partial<TasksResponse>): TasksResponse => ({
  total: 1,
  documents: [
    {
      id: '1',
      $id: 'task-123',
      content: 'Upcoming task',
      due_date: null,
      completed: false,
      projectId: null,
      $createdAt: '2025-12-12T00:00:00.000Z',
      $updatedAt: '2025-12-12T00:00:00.000Z',
      $collectionId: 'tasks',
      $databaseId: 'default',
      $permissions: [],
    },
  ],
  ...overrides,
});

describe('tasksUpcomingLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('when upcoming tasks exist', () => {
    it('returns upcoming tasks list', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], content: 'Upcoming task 1' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-456', content: 'Upcoming task 2', completed: true },
        ],
      });

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });

    it('includes tasks with future due dates', async () => {
      const futureDate = new Date('2025-12-25');
      const mockTasks = createMockTasks({
        documents: [
          {
            ...createMockTasks().documents[0],
            content: 'Due later',
            due_date: futureDate,
          },
        ],
      });

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toEqual(futureDate);
    });

    it('includes tasks assigned to a project', async () => {
      const mockTasks = createMockTasks({
        documents: [
          {
            ...createMockTasks().documents[0],
            content: 'Project-based task',
            projectId: {
              $id: 'project-1',
              userId: 'user-412',
              name: 'Future Project',
              color_name: 'red',
              color_hex: '#FF0000',
              $createdAt: '2023-01-01T00:00:00.000Z',
              $updatedAt: '2023-01-01T00:00:00.000Z',
              $collectionId: 'projects',
              $databaseId: 'default',
              $permissions: [],
              tasks: [],
            },
          },
        ],
      });

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });
  });

  describe('when no upcoming tasks exist', () => {
    it('returns an empty tasks array', async () => {
      const mockTasks = createMockTasks({ total: 0, documents: [] });

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws if service call fails', async () => {
      mockedTaskService.getUpcomingTasks.mockRejectedValue(new Error('Service failed'));

      await expect(tasksUpcomingLoader(createLoaderArgs())).rejects.toThrow('Service failed');
      expect(mockedTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
    });
  });

  describe('data validation', () => {
    it('returns a valid TasksLoaderData object', async () => {
      const mockTasks = createMockTasks();

      mockedTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total', 1);
      expect(result.tasks.documents).toHaveLength(1);
    });
  });
});
