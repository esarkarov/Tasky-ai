import { tasksInboxLoader } from '@/router/loaders/tasks-inbox/tasks-inbox.loader';
import { taskService } from '@/services/task/task.service';
import type { TasksLoaderData } from '@/types/loaders.types';
import type { TasksResponse } from '@/types/tasks.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getInboxTasks: vi.fn(),
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
      content: 'Inbox task',
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
  ...overrides,
});

describe('tasksInboxLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('successful loading', () => {
    it('returns inbox tasks', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], content: 'Inbox task 1' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-456', content: 'Inbox task 2', completed: true },
        ],
      });

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });

    it('handles tasks with mixed completion status', async () => {
      const mockTasks = createMockTasks({
        total: 3,
        documents: [
          { ...createMockTasks().documents[0], content: 'Pending task' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-456', completed: true, content: 'Completed task' },
          { ...createMockTasks().documents[0], id: '3', $id: 'task-789', content: 'Another pending task' },
        ],
      });

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.total).toBe(3);
      expect(result.tasks.documents).toHaveLength(3);
    });

    it('handles tasks with due dates', async () => {
      const mockTasks = createMockTasks({
        documents: [
          {
            ...createMockTasks().documents[0],
            content: 'Task with due date',
            due_date: new Date('2023-12-31'),
          },
        ],
      });

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toBeInstanceOf(Date);
    });
  });

  describe('when no inbox tasks exist', () => {
    it('returns an empty tasks array', async () => {
      const mockTasks = createMockTasks({ total: 0, documents: [] });

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws when service call fails', async () => {
      mockedTaskService.getInboxTasks.mockRejectedValue(new Error('Service error'));

      await expect(tasksInboxLoader(createLoaderArgs())).rejects.toThrow('Service error');
      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
    });
  });

  describe('data structure validation', () => {
    it('returns correct TasksLoaderData format', async () => {
      const mockTasks = createMockTasks();

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks.total).toBe(1);
      expect(result.tasks.documents).toHaveLength(1);
      expect(result.tasks.documents[0].projectId).toBeNull();
    });

    it('ensures all inbox tasks have null projectId', async () => {
      const mockTasks = createMockTasks({
        total: 2,
        documents: [
          { ...createMockTasks().documents[0], content: 'Inbox task 1' },
          { ...createMockTasks().documents[0], id: '2', $id: 'task-456', content: 'Inbox task 2' },
        ],
      });

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      const allInbox = result.tasks.documents.every((task) => task.projectId === null);
      expect(allInbox).toBe(true);
    });
  });

  describe('loader behavior', () => {
    it('does not depend on loader parameters', async () => {
      const mockTasks = createMockTasks({ total: 0, documents: [] });

      mockedTaskService.getInboxTasks.mockResolvedValue(mockTasks);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(mockedTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(result).toEqual({ tasks: mockTasks });
    });
  });
});
