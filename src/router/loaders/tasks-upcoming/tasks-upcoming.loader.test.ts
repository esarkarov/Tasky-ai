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

const mockTaskService = vi.mocked(taskService);

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('tasksUpcomingLoader', () => {
  describe('success scenarios', () => {
    it('returns a list of upcoming tasks', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], content: 'Upcoming task 1' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-456', content: 'Upcoming task 2', completed: true },
        ],
      });
      mockTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result.tasks).toEqual(mockTasks);
    });

    it('includes tasks with future due dates', async () => {
      const futureDate = new Date('2025-12-25');
      const mockTasks = createMockTasks({
        documents: [{ ...createMockTasks().documents[0], content: 'Due later', due_date: futureDate }],
      });
      mockTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toEqual(futureDate);
    });

    it('includes tasks linked to a project', async () => {
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
      mockTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });
  });

  describe('empty state', () => {
    it('returns an empty list when no upcoming tasks exist', async () => {
      const mockTasks = createMockTasks({ total: 0, documents: [] });
      mockTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws if the task service fails', async () => {
      mockTaskService.getUpcomingTasks.mockRejectedValue(new Error('Service failed'));

      await expect(tasksUpcomingLoader(createLoaderArgs())).rejects.toThrow('Service failed');
      expect(mockTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
    });
  });

  describe('data shape validation', () => {
    it('returns valid TasksLoaderData structure', async () => {
      const mockTasks = createMockTasks();
      mockTaskService.getUpcomingTasks.mockResolvedValue(mockTasks);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total', 1);
      expect(result.tasks.documents).toHaveLength(1);
    });
  });
});
