import { env } from '@/config/env.config';
import { databases } from '@/lib/appwrite';
import { taskQueries } from '@/queries/task/task.queries';
import { TaskCreateInput, TaskEntity, TasksResponse, TaskUpdateInput } from '@/types/tasks.types';
import { generateID } from '@/utils/text/text.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { taskRepository } from './task.repository';

vi.mock('@/config/env.config');

vi.mock('@/lib/appwrite', () => ({
  databases: {
    getDocument: vi.fn(),
    listDocuments: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

vi.mock('@/queries/task/task.queries', () => ({
  taskQueries: {
    todayCount: vi.fn(),
    inboxCount: vi.fn(),
    completedTasks: vi.fn(),
    inboxTasks: vi.fn(),
    todayTasks: vi.fn(),
    upcomingTasks: vi.fn(),
  },
}));

vi.mock('@/utils/text/text.utils', () => ({
  generateID: vi.fn(),
}));

const mockedDatabases = vi.mocked(databases);
const mockedTaskQueries = vi.mocked(taskQueries);
const mockedGenerateID = vi.mocked(generateID);

describe('taskRepository', () => {
  const MOCK_DATABASE_ID = 'test-database-id';
  const MOCK_COLLECTION_ID = 'test-tasks-collection';
  const MOCK_TASK_ID = 'task-123';
  const MOCK_USER_ID = 'user-123';
  const MOCK_PROJECT_ID = 'project-123';
  const MOCK_TODAY_DATE = '2023-01-01T00:00:00.000Z';
  const MOCK_TOMORROW_DATE = '2023-01-02T00:00:00.000Z';
  const MOCK_QUERIES = ['query1'];

  const createMockTask = (overrides?: Partial<TaskEntity>): TaskEntity => ({
    $id: MOCK_TASK_ID,
    id: MOCK_TASK_ID,
    content: 'Test Task',
    due_date: new Date(),
    completed: false,
    projectId: null,
    $createdAt: '',
    $updatedAt: '',
    $permissions: [],
    $databaseId: '',
    $collectionId: '',
    ...overrides,
  });

  const createMockTasksResponse = (tasks: TaskEntity[] = [createMockTask()], total?: number): TasksResponse => ({
    documents: tasks,
    total: total ?? tasks.length,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    env.appwriteDatabaseId = MOCK_DATABASE_ID;
    env.appwriteTasksCollectionId = MOCK_COLLECTION_ID;
  });

  describe('count methods', () => {
    describe('getTodayCountByUserId', () => {
      it('should return today task count', async () => {
        const expectedCount = 5;
        mockedTaskQueries.todayCount.mockReturnValue(MOCK_QUERIES);
        mockedDatabases.listDocuments.mockResolvedValue(createMockTasksResponse([], expectedCount));

        const result = await taskRepository.getTodayCountByUserId(MOCK_TODAY_DATE, MOCK_TOMORROW_DATE, MOCK_USER_ID);

        expect(mockedTaskQueries.todayCount).toHaveBeenCalledWith(MOCK_TODAY_DATE, MOCK_TOMORROW_DATE, MOCK_USER_ID);
        expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_QUERIES);
        expect(result).toBe(expectedCount);
      });

      it('should propagate error when query fails', async () => {
        mockedTaskQueries.todayCount.mockReturnValue([]);
        mockedDatabases.listDocuments.mockRejectedValue(new Error('Query failed'));

        await expect(
          taskRepository.getTodayCountByUserId(MOCK_TODAY_DATE, MOCK_TOMORROW_DATE, MOCK_USER_ID)
        ).rejects.toThrow('Query failed');
      });
    });

    describe('getInboxCountByUserId', () => {
      it('should return inbox task count', async () => {
        const expectedCount = 3;
        mockedTaskQueries.inboxCount.mockReturnValue(MOCK_QUERIES);
        mockedDatabases.listDocuments.mockResolvedValue(createMockTasksResponse([], expectedCount));

        const result = await taskRepository.getInboxCountByUserId(MOCK_USER_ID);

        expect(mockedTaskQueries.inboxCount).toHaveBeenCalledWith(MOCK_USER_ID);
        expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_QUERIES);
        expect(result).toBe(expectedCount);
      });

      it('should propagate error when query fails', async () => {
        mockedTaskQueries.inboxCount.mockReturnValue([]);
        mockedDatabases.listDocuments.mockRejectedValue(new Error('Query failed'));

        await expect(taskRepository.getInboxCountByUserId(MOCK_USER_ID)).rejects.toThrow('Query failed');
      });
    });
  });

  describe('get methods', () => {
    describe('getCompleted', () => {
      it('should return completed tasks', async () => {
        const mockResponse = createMockTasksResponse();
        mockedTaskQueries.completedTasks.mockReturnValue(MOCK_QUERIES);
        mockedDatabases.listDocuments.mockResolvedValue(mockResponse);

        const result = await taskRepository.getCompleted(MOCK_USER_ID);

        expect(mockedTaskQueries.completedTasks).toHaveBeenCalledWith(MOCK_USER_ID);
        expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_QUERIES);
        expect(result).toEqual(mockResponse);
      });

      it('should propagate error when query fails', async () => {
        mockedTaskQueries.completedTasks.mockReturnValue([]);
        mockedDatabases.listDocuments.mockRejectedValue(new Error('Query failed'));

        await expect(taskRepository.getCompleted(MOCK_USER_ID)).rejects.toThrow('Query failed');
      });
    });

    describe('getInbox', () => {
      it('should return inbox tasks', async () => {
        const mockResponse = createMockTasksResponse();
        mockedTaskQueries.inboxTasks.mockReturnValue(MOCK_QUERIES);
        mockedDatabases.listDocuments.mockResolvedValue(mockResponse);

        const result = await taskRepository.getInbox(MOCK_USER_ID);

        expect(mockedTaskQueries.inboxTasks).toHaveBeenCalledWith(MOCK_USER_ID);
        expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_QUERIES);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getToday', () => {
      it('should return today tasks', async () => {
        const mockResponse = createMockTasksResponse();
        mockedTaskQueries.todayTasks.mockReturnValue(MOCK_QUERIES);
        mockedDatabases.listDocuments.mockResolvedValue(mockResponse);

        const result = await taskRepository.getToday(MOCK_TODAY_DATE, MOCK_TOMORROW_DATE, MOCK_USER_ID);

        expect(mockedTaskQueries.todayTasks).toHaveBeenCalledWith(MOCK_TODAY_DATE, MOCK_TOMORROW_DATE, MOCK_USER_ID);
        expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_QUERIES);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getUpcoming', () => {
      it('should return upcoming tasks', async () => {
        const mockResponse = createMockTasksResponse();
        mockedTaskQueries.upcomingTasks.mockReturnValue(MOCK_QUERIES);
        mockedDatabases.listDocuments.mockResolvedValue(mockResponse);

        const result = await taskRepository.getUpcoming(MOCK_TODAY_DATE, MOCK_USER_ID);

        expect(mockedTaskQueries.upcomingTasks).toHaveBeenCalledWith(MOCK_TODAY_DATE, MOCK_USER_ID);
        expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_QUERIES);
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('createMany', () => {
    const createMockTasksData = () => [
      { content: 'Task 1', due_date: new Date(), completed: false, projectId: null, userId: MOCK_USER_ID },
      {
        content: 'Task 2',
        due_date: null,
        completed: true,
        projectId: MOCK_PROJECT_ID,
        userId: MOCK_USER_ID,
        id: 'custom-id',
      },
    ];

    it('should create multiple tasks with generated and custom IDs', async () => {
      const tasksData = createMockTasksData();
      const mockGeneratedId = 'generated-id';
      const mockTask = createMockTask();
      mockedGenerateID.mockReturnValue(mockGeneratedId);
      mockedDatabases.createDocument.mockResolvedValue(mockTask);

      const result = await taskRepository.createMany(tasksData);

      expect(mockedGenerateID).toHaveBeenCalled();
      expect(mockedDatabases.createDocument).toHaveBeenCalledTimes(2);
      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        MOCK_DATABASE_ID,
        MOCK_COLLECTION_ID,
        mockGeneratedId,
        expect.objectContaining({ content: 'Task 1' })
      );
      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        MOCK_DATABASE_ID,
        MOCK_COLLECTION_ID,
        'custom-id',
        expect.objectContaining({ content: 'Task 2' })
      );
      expect(result).toEqual([mockTask, mockTask]);
    });

    it('should propagate error when creation fails', async () => {
      const tasksData = createMockTasksData();
      mockedGenerateID.mockReturnValue('generated-id');
      mockedDatabases.createDocument.mockRejectedValue(new Error('Create failed'));

      await expect(taskRepository.createMany(tasksData)).rejects.toThrow('Create failed');
    });
  });

  describe('create', () => {
    const createMockCreateData = (overrides?: Partial<TaskCreateInput>): TaskCreateInput => ({
      content: 'New Task',
      due_date: new Date(),
      completed: false,
      projectId: null,
      userId: MOCK_USER_ID,
      ...overrides,
    });

    it('should create task successfully', async () => {
      const createData = createMockCreateData();
      const mockTask = createMockTask();
      mockedDatabases.createDocument.mockResolvedValue(mockTask);

      const result = await taskRepository.create(MOCK_TASK_ID, createData);

      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        MOCK_DATABASE_ID,
        MOCK_COLLECTION_ID,
        MOCK_TASK_ID,
        createData
      );
      expect(result).toEqual(mockTask);
    });

    it('should propagate error when creation fails', async () => {
      const createData = createMockCreateData();
      mockedDatabases.createDocument.mockRejectedValue(new Error('Create failed'));

      await expect(taskRepository.create(MOCK_TASK_ID, createData)).rejects.toThrow('Create failed');
    });
  });

  describe('update', () => {
    const createMockUpdateData = (overrides?: Partial<TaskUpdateInput>): TaskUpdateInput => ({
      content: 'Updated Task',
      due_date: new Date(),
      projectId: MOCK_PROJECT_ID,
      ...overrides,
    });

    it('should update task successfully', async () => {
      const updateData = createMockUpdateData();
      const updatedTask = createMockTask(updateData as TaskEntity);
      mockedDatabases.updateDocument.mockResolvedValue(updatedTask);

      const result = await taskRepository.update(MOCK_TASK_ID, updateData);

      expect(mockedDatabases.updateDocument).toHaveBeenCalledWith(
        MOCK_DATABASE_ID,
        MOCK_COLLECTION_ID,
        MOCK_TASK_ID,
        updateData
      );
      expect(result).toEqual(updatedTask);
    });

    it('should propagate error when update fails', async () => {
      const updateData = createMockUpdateData();
      mockedDatabases.updateDocument.mockRejectedValue(new Error('Update failed'));

      await expect(taskRepository.update(MOCK_TASK_ID, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete task successfully', async () => {
      mockedDatabases.deleteDocument.mockResolvedValue({});

      await taskRepository.delete(MOCK_TASK_ID);

      expect(mockedDatabases.deleteDocument).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_TASK_ID);
    });

    it('should propagate error when deletion fails', async () => {
      mockedDatabases.deleteDocument.mockRejectedValue(new Error('Delete failed'));

      await expect(taskRepository.delete(MOCK_TASK_ID)).rejects.toThrow('Delete failed');
    });
  });
});
