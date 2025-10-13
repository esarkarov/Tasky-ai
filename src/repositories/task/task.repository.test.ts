import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskRepository } from './task.repository';
import { databases } from '@/lib/appwrite';
import { env } from '@/config/env.config';
import { taskQueries } from '@/queries/task/task.queries';
import { generateID } from '@/utils/text/text.utils';
import { Task, TasksResponse, TaskCreateData, TaskUpdateData } from '@/types/tasks.types';

vi.mock('@/lib/appwrite', () => ({
  databases: {
    getDocument: vi.fn(),
    listDocuments: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

vi.mock('@/config/env.config', () => ({
  env: {
    appwriteDatabaseId: 'test-database',
    appwriteTasksCollectionId: 'test-tasks',
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
const mockedEnv = vi.mocked(env);
const mockedTaskQueries = vi.mocked(taskQueries);
const mockedGenerateID = vi.mocked(generateID);

describe('taskRepository', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockDatabaseId = 'test-database';
  const mockCollectionId = 'test-tasks';
  const mockTaskId = 'task-123';
  const mockUserId = 'user-123';
  const mockTodayDate = '2023-01-01T00:00:00.000Z';
  const mockTomorrowDate = '2023-01-02T00:00:00.000Z';

  const mockTask: Task = {
    $id: mockTaskId,
    id: mockTaskId,
    content: 'Test Task',
    due_date: new Date(),
    completed: false,
    projectId: null,
    $createdAt: '',
    $updatedAt: '',
    $permissions: [],
    $databaseId: '',
    $collectionId: '',
  };
  const mockTasksResponse: TasksResponse = {
    documents: [mockTask],
    total: 1,
  };

  beforeEach(() => {
    mockedEnv.appwriteDatabaseId = mockDatabaseId;
    mockedEnv.appwriteTasksCollectionId = mockCollectionId;
  });

  describe('getTodayCountByUserId', () => {
    it('should return today task count successfully', async () => {
      const mockQueries = ['query1'];
      mockedTaskQueries.todayCount.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue({ total: 5, documents: [] });

      const result = await taskRepository.getTodayCountByUserId(mockTodayDate, mockTomorrowDate, mockUserId);

      expect(mockedTaskQueries.todayCount).toHaveBeenCalledWith(mockTodayDate, mockTomorrowDate, mockUserId);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toBe(5);
    });

    it('should propagate error when listDocuments fails', async () => {
      mockedTaskQueries.todayCount.mockReturnValue([]);
      mockedDatabases.listDocuments.mockRejectedValue(new Error('Query failed'));

      await expect(taskRepository.getTodayCountByUserId(mockTodayDate, mockTomorrowDate, mockUserId)).rejects.toThrow(
        'Query failed'
      );
    });
  });

  describe('getInboxCountByUserId', () => {
    it('should return inbox task count successfully', async () => {
      const mockQueries = ['query1'];
      mockedTaskQueries.inboxCount.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue({ total: 3, documents: [] });

      const result = await taskRepository.getInboxCountByUserId(mockUserId);

      expect(mockedTaskQueries.inboxCount).toHaveBeenCalledWith(mockUserId);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toBe(3);
    });

    it('should propagate error when listDocuments fails', async () => {
      mockedTaskQueries.inboxCount.mockReturnValue([]);
      const mockError = new Error('Query failed');
      mockedDatabases.listDocuments.mockRejectedValue(mockError);

      await expect(taskRepository.getInboxCountByUserId(mockUserId)).rejects.toThrow('Query failed');
    });
  });

  describe('getCompleted', () => {
    it('should return completed tasks successfully', async () => {
      const mockQueries = ['query1'];
      mockedTaskQueries.completedTasks.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue(mockTasksResponse);

      const result = await taskRepository.getCompleted(mockUserId);

      expect(mockedTaskQueries.completedTasks).toHaveBeenCalledWith(mockUserId);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toEqual(mockTasksResponse);
    });

    it('should propagate error when listDocuments fails', async () => {
      mockedTaskQueries.completedTasks.mockReturnValue([]);
      mockedDatabases.listDocuments.mockRejectedValue(new Error('Query failed'));

      await expect(taskRepository.getCompleted(mockUserId)).rejects.toThrow('Query failed');
    });
  });

  describe('getInbox', () => {
    it('should return inbox tasks successfully', async () => {
      const mockQueries = ['query1'];
      mockedTaskQueries.inboxTasks.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue(mockTasksResponse);

      const result = await taskRepository.getInbox(mockUserId);

      expect(mockedTaskQueries.inboxTasks).toHaveBeenCalledWith(mockUserId);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toEqual(mockTasksResponse);
    });
  });

  describe('getToday', () => {
    it('should return today tasks successfully', async () => {
      const mockQueries = ['query1'];
      mockedTaskQueries.todayTasks.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue(mockTasksResponse);

      const result = await taskRepository.getToday(mockTodayDate, mockTomorrowDate, mockUserId);

      expect(mockedTaskQueries.todayTasks).toHaveBeenCalledWith(mockTodayDate, mockTomorrowDate, mockUserId);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toEqual(mockTasksResponse);
    });
  });

  describe('getUpcoming', () => {
    it('should return upcoming tasks successfully', async () => {
      const mockQueries = ['query1'];
      mockedTaskQueries.upcomingTasks.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue(mockTasksResponse);

      const result = await taskRepository.getUpcoming(mockTodayDate, mockUserId);

      expect(mockedTaskQueries.upcomingTasks).toHaveBeenCalledWith(mockTodayDate, mockUserId);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toEqual(mockTasksResponse);
    });
  });

  describe('createMany', () => {
    const mockTasksData: Array<TaskCreateData & { id?: string }> = [
      { content: 'Task 1', due_date: new Date(), completed: false, projectId: null, userId: mockUserId },
      {
        content: 'Task 2',
        due_date: null,
        completed: true,
        projectId: 'project-123',
        userId: mockUserId,
        id: 'custom-id',
      },
    ];

    it('should create multiple tasks with generated IDs when no IDs provided', async () => {
      const mockGeneratedId = 'generated-id';
      mockedGenerateID.mockReturnValue(mockGeneratedId);
      mockedDatabases.createDocument.mockResolvedValue(mockTask);

      const result = await taskRepository.createMany(mockTasksData);

      expect(mockedGenerateID).toHaveBeenCalled();
      expect(mockedDatabases.createDocument).toHaveBeenCalledTimes(2);
      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        mockDatabaseId,
        mockCollectionId,
        mockGeneratedId,
        expect.objectContaining({ content: 'Task 1' })
      );
      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        mockDatabaseId,
        mockCollectionId,
        'custom-id',
        expect.objectContaining({ content: 'Task 2' })
      );
      expect(result).toEqual([mockTask, mockTask]);
    });

    it('should propagate error when any create fails', async () => {
      mockedGenerateID.mockReturnValue('generated-id');
      mockedDatabases.createDocument.mockRejectedValue(new Error('Create failed'));

      await expect(taskRepository.createMany(mockTasksData)).rejects.toThrow('Create failed');
    });
  });

  describe('create', () => {
    const mockCreateData: TaskCreateData = {
      content: 'New Task',
      due_date: new Date(),
      completed: false,
      projectId: null,
      userId: mockUserId,
    };

    it('should create task successfully', async () => {
      mockedDatabases.createDocument.mockResolvedValue(mockTask);

      const result = await taskRepository.create(mockTaskId, mockCreateData);

      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        mockDatabaseId,
        mockCollectionId,
        mockTaskId,
        mockCreateData
      );
      expect(result).toEqual(mockTask);
    });

    it('should propagate error when createDocument fails', async () => {
      mockedDatabases.createDocument.mockRejectedValue(new Error('Create failed'));

      await expect(taskRepository.create(mockTaskId, mockCreateData)).rejects.toThrow('Create failed');
    });
  });

  describe('update', () => {
    const mockUpdateData: TaskUpdateData = {
      content: 'Updated Task',
      due_date: new Date(),
      projectId: 'project-123',
    };

    it('should update task successfully', async () => {
      const updatedTask = { ...mockTask, ...mockUpdateData };
      mockedDatabases.updateDocument.mockResolvedValue(updatedTask);

      const result = await taskRepository.update(mockTaskId, mockUpdateData);

      expect(mockedDatabases.updateDocument).toHaveBeenCalledWith(
        mockDatabaseId,
        mockCollectionId,
        mockTaskId,
        mockUpdateData
      );
      expect(result).toEqual(updatedTask);
    });

    it('should propagate error when updateDocument fails', async () => {
      mockedDatabases.updateDocument.mockRejectedValue(new Error('Update failed'));

      await expect(taskRepository.update(mockTaskId, mockUpdateData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete task successfully', async () => {
      mockedDatabases.deleteDocument.mockResolvedValue({});

      await taskRepository.delete(mockTaskId);

      expect(mockedDatabases.deleteDocument).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockTaskId);
    });

    it('should propagate error when deleteDocument fails', async () => {
      mockedDatabases.deleteDocument.mockRejectedValue(new Error('Delete failed'));

      await expect(taskRepository.delete(mockTaskId)).rejects.toThrow('Delete failed');
    });
  });
});
