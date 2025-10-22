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
  ],
  ...overrides,
});

describe('tasksCompletedLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('success scenarios', () => {
    it('returns completed tasks', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], id: '1', $id: 'task-123', content: 'Completed task 1' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-456', content: 'Completed task 2' },
        ],
      });

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });

    it('returns tasks with project references', async () => {
      const mockTasks = createMockTasks({
        documents: [
          {
            ...createMockTasks().documents[0],
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
          },
        ],
      });

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });

    it('returns tasks with due dates', async () => {
      const mockTasks = createMockTasks({
        documents: [
          {
            ...createMockTasks().documents[0],
            due_date: new Date('2023-12-31'),
            content: 'Task with due date',
          },
        ],
      });

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result.tasks.documents[0].due_date).toBeInstanceOf(Date);
    });
  });

  describe('when no tasks exist', () => {
    it('returns empty tasks list', async () => {
      const mockTasks = createMockTasks({ total: 0, documents: [] });

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws if task service fails', async () => {
      mockedTaskService.getCompletedTasks.mockRejectedValue(new Error('Service error'));

      await expect(tasksCompletedLoader(createLoaderArgs())).rejects.toThrow('Service error');
      expect(mockedTaskService.getCompletedTasks).toHaveBeenCalledOnce();
    });
  });

  describe('data validation', () => {
    it('returns valid TasksLoaderData structure', async () => {
      const mockTasks = createMockTasks();

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total');
      expect(result.tasks).toHaveProperty('documents');
      expect(result.tasks.total).toBe(1);
      expect(result.tasks.documents).toHaveLength(1);
      expect(result.tasks.documents[0].completed).toBe(true);
    });

    it('ensures all returned tasks are completed', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], completed: true },
          { ...createMockTasks().documents[0], completed: true },
        ],
      });

      mockedTaskService.getCompletedTasks.mockResolvedValue(mockTasks);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      const allCompleted = result.tasks.documents.every((task) => task.completed === true);
      expect(allCompleted).toBe(true);
    });
  });
});
