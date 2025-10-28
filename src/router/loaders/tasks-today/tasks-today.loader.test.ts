import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksTodayLoader } from './tasks-today.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksResponse } from '@/types/tasks.types';
import type { TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getTodayTasks: vi.fn(),
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
      content: 'Today task',
      completed: false,
      due_date: null,
      projectId: null,
      $createdAt: '2025-10-15T00:00:00.000Z',
      $updatedAt: '2025-10-15T00:00:00.000Z',
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

describe('tasksTodayLoader', () => {
  describe('success cases', () => {
    it('returns a list of today tasks', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], content: 'Today task 1' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-456', content: 'Today task 2', completed: true },
        ],
      });
      mockTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockTaskService.getTodayTasks).toHaveBeenCalledOnce();
      expect(result.tasks).toEqual(mockTasks);
    });

    it('includes tasks with due dates set to today', async () => {
      const today = new Date();
      const mockTasks = createMockTasks({
        documents: [
          {
            ...createMockTasks().documents[0],
            content: 'Due today',
            due_date: today,
          },
        ],
      });
      mockTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toEqual(today);
    });

    it('includes tasks linked to a project', async () => {
      const projectId = {
        $id: 'project-1',
        userId: 'user-456',
        name: 'Work Project',
        color_name: 'red',
        color_hex: '#FF0000',
        $createdAt: '2023-01-01T00:00:00.000Z',
        $updatedAt: '2023-01-01T00:00:00.000Z',
        $collectionId: 'projects',
        $databaseId: 'default',
        $permissions: [],
        tasks: [],
      };

      const mockTasks = createMockTasks({
        documents: [{ ...createMockTasks().documents[0], content: 'Project task', projectId }],
      });
      mockTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });
  });

  describe('empty state', () => {
    it('returns an empty task list when no tasks exist', async () => {
      const mockTasks = createMockTasks({ total: 0, documents: [] });
      mockTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockTaskService.getTodayTasks).toHaveBeenCalledOnce();
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws if the task service fails', async () => {
      mockTaskService.getTodayTasks.mockRejectedValue(new Error('Service failed'));

      await expect(tasksTodayLoader(createLoaderArgs())).rejects.toThrow('Service failed');
      expect(mockTaskService.getTodayTasks).toHaveBeenCalledOnce();
    });
  });

  describe('data shape validation', () => {
    it('returns correct TasksLoaderData structure', async () => {
      const mockTasks = createMockTasks();
      mockTaskService.getTodayTasks.mockResolvedValue(mockTasks);

      const result = (await tasksTodayLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks.total).toBe(1);
      expect(result.tasks.documents).toHaveLength(1);
    });
  });
});
