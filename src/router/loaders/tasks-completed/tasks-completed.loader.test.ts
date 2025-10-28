import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksCompletedLoader } from './tasks-completed.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksResponse } from '@/types/tasks.types';
import type { TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getCompletedTasks: vi.fn(),
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
      content: 'Completed task',
      completed: true,
      due_date: null,
      projectId: null,
      $createdAt: '2023-01-01T00:00:00.000Z',
      $updatedAt: '2023-01-01T00:00:00.000Z',
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

describe('tasksCompletedLoader', () => {
  describe('success cases', () => {
    it('returns multiple completed tasks', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], id: '1', $id: 'task-1', content: 'Task 1' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-2', content: 'Task 2' },
        ],
      });
      mockTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result).toEqual(expect.objectContaining({ tasks: mockTasks }));
    });

    it('includes task project references', async () => {
      const projectId = {
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
      };

      const mockTasks = createMockTasks({
        documents: [{ ...createMockTasks().documents[0], projectId }],
      });
      mockTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });

    it('returns tasks with due dates', async () => {
      const mockTasks = createMockTasks({
        documents: [{ ...createMockTasks().documents[0], due_date: new Date('2023-12-31') }],
      });
      mockTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toBeInstanceOf(Date);
    });
  });

  describe('empty state', () => {
    it('returns empty tasks list when none exist', async () => {
      const mockTasks = createMockTasks({ total: 0, documents: [] });
      mockTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws if service call fails', async () => {
      mockTaskService.getCompletedTasks.mockRejectedValue(new Error('Service error'));

      await expect(tasksCompletedLoader(createLoaderArgs())).rejects.toThrow('Service error');
      expect(mockTaskService.getCompletedTasks).toHaveBeenCalledOnce();
    });
  });

  describe('data structure validation', () => {
    it('returns correct TasksLoaderData shape', async () => {
      const mockTasks = createMockTasks();
      mockTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toMatchObject({
        total: 1,
        documents: expect.any(Array),
      });
    });

    it('ensures all tasks are completed', async () => {
      const mockTasks = createMockTasks({
        documents: [
          { ...createMockTasks().documents[0], completed: true },
          { ...createMockTasks().documents[0], completed: true },
        ],
      });
      mockTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      const allCompleted = result.tasks.documents.every((task) => task.completed);
      expect(allCompleted).toBe(true);
    });
  });
});
