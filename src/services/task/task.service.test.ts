import { taskRepository } from '@/repositories/task.repository';
import { AIGeneratedTask, Task, TaskFormData, TasksResponse } from '@/types/tasks.types';
import { getUserId } from '@/utils/auth.utils';
import { generateID } from '@/utils/text.utils';
import { startOfToday, startOfTomorrow } from 'date-fns';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { taskService } from './task.service';

vi.mock('@/repositories/task.repository', () => ({
  taskRepository: {
    getTodayCountByUserId: vi.fn(),
    getInboxCountByUserId: vi.fn(),
    getCompleted: vi.fn(),
    getInbox: vi.fn(),
    getToday: vi.fn(),
    getUpcoming: vi.fn(),
    createMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('@/utils/auth.utils', () => ({
  getUserId: vi.fn(),
}));
vi.mock('@/utils/text.utils', () => ({
  generateID: vi.fn(),
}));
vi.mock('date-fns', () => ({
  startOfToday: vi.fn(),
  startOfTomorrow: vi.fn(),
}));

const mockedTaskRepository = vi.mocked(taskRepository);
const mockedGetUserId = vi.mocked(getUserId);
const mockedGenerateID = vi.mocked(generateID);
const mockedStartOfToday = vi.mocked(startOfToday);
const mockedStartOfTomorrow = vi.mocked(startOfTomorrow);

describe('taskService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockUserId = 'user-123';
  const mockTaskId = 'task-123';
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
    mockedGetUserId.mockReturnValue(mockUserId);
    mockedStartOfToday.mockReturnValue(new Date(mockTodayDate));
    mockedStartOfTomorrow.mockReturnValue(new Date(mockTomorrowDate));
  });

  describe('getUpcomingTasks', () => {
    it('should return upcoming tasks successfully', async () => {
      mockedTaskRepository.getUpcoming.mockResolvedValue(mockTasksResponse);

      const result = await taskService.getUpcomingTasks();

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedStartOfToday).toHaveBeenCalled();
      expect(mockedTaskRepository.getUpcoming).toHaveBeenCalledWith(mockTodayDate, mockUserId);
      expect(result).toEqual(mockTasksResponse);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.getUpcoming.mockRejectedValue(new Error('Database error'));

      await expect(taskService.getUpcomingTasks()).rejects.toThrow('Failed to load upcoming tasks. Please try again.');
    });
  });

  describe('getTodayTasks', () => {
    it('should return today tasks successfully', async () => {
      mockedTaskRepository.getToday.mockResolvedValue(mockTasksResponse);

      const result = await taskService.getTodayTasks();

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedStartOfToday).toHaveBeenCalled();
      expect(mockedStartOfTomorrow).toHaveBeenCalled();
      expect(mockedTaskRepository.getToday).toHaveBeenCalledWith(mockTodayDate, mockTomorrowDate, mockUserId);
      expect(result).toEqual(mockTasksResponse);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.getToday.mockRejectedValue(new Error('Database error'));

      await expect(taskService.getTodayTasks()).rejects.toThrow("Failed to load today's tasks. Please try again.");
    });
  });

  describe('getInboxTasks', () => {
    it('should return inbox tasks successfully', async () => {
      mockedTaskRepository.getInbox.mockResolvedValue(mockTasksResponse);

      const result = await taskService.getInboxTasks();

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedTaskRepository.getInbox).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockTasksResponse);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.getInbox.mockRejectedValue(new Error('Database error'));

      await expect(taskService.getInboxTasks()).rejects.toThrow("Failed to load inbox's tasks. Please try again.");
    });
  });

  describe('getCompletedTasks', () => {
    it('should return completed tasks successfully', async () => {
      mockedTaskRepository.getCompleted.mockResolvedValue(mockTasksResponse);

      const result = await taskService.getCompletedTasks();

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedTaskRepository.getCompleted).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockTasksResponse);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.getCompleted.mockRejectedValue(new Error('Database error'));

      await expect(taskService.getCompletedTasks()).rejects.toThrow(
        'Failed to load completed tasks. Please try again.'
      );
    });
  });

  describe('getInboxTaskCount', () => {
    it('should return inbox task count successfully', async () => {
      mockedTaskRepository.getInboxCountByUserId.mockResolvedValue(5);

      const result = await taskService.getInboxTaskCount();

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedTaskRepository.getInboxCountByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(5);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.getInboxCountByUserId.mockRejectedValue(new Error('Database error'));

      await expect(taskService.getInboxTaskCount()).rejects.toThrow('Failed to load inbox task count');
    });
  });

  describe('getTodayTaskCount', () => {
    it('should return today task count successfully', async () => {
      mockedTaskRepository.getTodayCountByUserId.mockResolvedValue(3);

      const result = await taskService.getTodayTaskCount();

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedStartOfToday).toHaveBeenCalled();
      expect(mockedStartOfTomorrow).toHaveBeenCalled();
      expect(mockedTaskRepository.getTodayCountByUserId).toHaveBeenCalledWith(
        mockTodayDate,
        mockTomorrowDate,
        mockUserId
      );
      expect(result).toBe(3);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.getTodayCountByUserId.mockRejectedValue(new Error('Database error'));

      await expect(taskService.getTodayTaskCount()).rejects.toThrow('Failed to load today task count');
    });
  });

  describe('getTaskCounts', () => {
    it('should return both inbox and today task counts successfully', async () => {
      mockedTaskRepository.getInboxCountByUserId.mockResolvedValue(5);
      mockedTaskRepository.getTodayCountByUserId.mockResolvedValue(3);

      const result = await taskService.getTaskCounts();

      expect(result).toEqual({ inboxTasks: 5, todayTasks: 3 });
    });

    it('should propagate error when inbox count fails', async () => {
      mockedTaskRepository.getInboxCountByUserId.mockRejectedValue(new Error('Inbox error'));
      mockedTaskRepository.getTodayCountByUserId.mockResolvedValue(3);

      await expect(taskService.getTaskCounts()).rejects.toThrow('Failed to load inbox task count');
    });

    it('should propagate error when today count fails', async () => {
      mockedTaskRepository.getInboxCountByUserId.mockResolvedValue(5);
      mockedTaskRepository.getTodayCountByUserId.mockRejectedValue(new Error('Today error'));

      await expect(taskService.getTaskCounts()).rejects.toThrow('Failed to load today task count');
    });
  });

  describe('createTasksForProject', () => {
    const mockProjectId = 'project-123';
    const mockAITasks: AIGeneratedTask[] = [
      { content: 'Task 1', due_date: new Date(), completed: false },
      { content: 'Task 2', due_date: null, completed: true },
    ];

    it('should create multiple tasks for project successfully', async () => {
      const mockCreatedTasks = [mockTask, { ...mockTask, id: 'task-456' }];
      mockedTaskRepository.createMany.mockResolvedValue(mockCreatedTasks);

      const result = await taskService.createTasksForProject(mockProjectId, mockAITasks);

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedTaskRepository.createMany).toHaveBeenCalledWith([
        {
          content: 'Task 1',
          due_date: mockAITasks[0].due_date,
          completed: false,
          projectId: mockProjectId,
          userId: mockUserId,
        },
        {
          content: 'Task 2',
          due_date: null,
          completed: true,
          projectId: mockProjectId,
          userId: mockUserId,
        },
      ]);
      expect(result).toEqual(mockCreatedTasks);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.createMany.mockRejectedValue(new Error('Database error'));

      await expect(taskService.createTasksForProject(mockProjectId, mockAITasks)).rejects.toThrow(
        'Failed to create project tasks'
      );
    });
  });

  describe('createTask', () => {
    const mockGeneratedId = 'generated-task-id';
    const mockFormData: TaskFormData = {
      content: 'New Task',
      due_date: new Date(),
      projectId: 'project-123',
    };

    it('should create task successfully', async () => {
      mockedGenerateID.mockReturnValue(mockGeneratedId);
      mockedTaskRepository.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(mockFormData);

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedGenerateID).toHaveBeenCalled();
      expect(mockedTaskRepository.create).toHaveBeenCalledWith(mockGeneratedId, {
        content: mockFormData.content,
        due_date: mockFormData.due_date,
        completed: false,
        projectId: mockFormData.projectId,
        userId: mockUserId,
      });
      expect(result).toEqual(mockTask);
    });

    it('should use provided completed status when available', async () => {
      const formDataWithCompleted = { ...mockFormData, completed: true };
      mockedGenerateID.mockReturnValue(mockGeneratedId);
      mockedTaskRepository.create.mockResolvedValue(mockTask);

      await taskService.createTask(formDataWithCompleted);

      expect(mockedTaskRepository.create).toHaveBeenCalledWith(mockGeneratedId, {
        content: mockFormData.content,
        due_date: mockFormData.due_date,
        completed: true,
        projectId: mockFormData.projectId,
        userId: mockUserId,
      });
    });

    it('should throw error when repository fails', async () => {
      mockedGenerateID.mockReturnValue(mockGeneratedId);
      mockedTaskRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(taskService.createTask(mockFormData)).rejects.toThrow('Failed to create task');
    });
  });

  describe('updateTask', () => {
    const mockUpdateData = {
      content: 'Updated Task',
      due_date: new Date(),
      projectId: null,
    };

    it('should update task successfully', async () => {
      const updatedTask = { ...mockTask, ...mockUpdateData };
      mockedTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(mockTaskId, mockUpdateData);

      expect(mockedTaskRepository.update).toHaveBeenCalledWith(mockTaskId, mockUpdateData);
      expect(result).toEqual(updatedTask);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(taskService.updateTask(mockTaskId, mockUpdateData)).rejects.toThrow('Failed to update task');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockedTaskRepository.delete.mockResolvedValue({});

      await taskService.deleteTask(mockTaskId);

      expect(mockedTaskRepository.delete).toHaveBeenCalledWith(mockTaskId);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(taskService.deleteTask(mockTaskId)).rejects.toThrow('Failed to delete task');
    });
  });
});
