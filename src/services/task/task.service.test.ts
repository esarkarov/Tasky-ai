import { taskRepository } from '@/repositories/task/task.repository';
import { AIGeneratedTask, TaskEntity, TaskFormInput, TasksResponse } from '@/types/tasks.types';
import { getUserId } from '@/utils/auth/auth.utils';
import { generateID } from '@/utils/text/text.utils';
import { startOfToday, startOfTomorrow } from 'date-fns';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { taskService } from './task.service';

vi.mock('@/repositories/task/task.repository', () => ({
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
vi.mock('@/utils/auth/auth.utils', () => ({
  getUserId: vi.fn(),
}));
vi.mock('@/utils/text/text.utils', () => ({
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
  const MOCK_USER_ID = 'user-123';
  const MOCK_TASK_ID = 'task-123';
  const MOCK_PROJECT_ID = 'project-123';
  const MOCK_TODAY_DATE = '2023-01-01T00:00:00.000Z';
  const MOCK_TOMORROW_DATE = '2023-01-02T00:00:00.000Z';

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

  const createMockTasksResponse = (tasks: TaskEntity[] = [createMockTask()]): TasksResponse => ({
    documents: tasks,
    total: tasks.length,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetUserId.mockReturnValue(MOCK_USER_ID);
    mockedStartOfToday.mockReturnValue(new Date(MOCK_TODAY_DATE));
    mockedStartOfTomorrow.mockReturnValue(new Date(MOCK_TOMORROW_DATE));
  });

  describe('get methods', () => {
    const testGetMethod = async (
      method: 'getUpcomingTasks' | 'getTodayTasks' | 'getInboxTasks' | 'getCompletedTasks',
      repositoryMethod: 'getUpcoming' | 'getToday' | 'getInbox' | 'getCompleted',
      repositoryArgs: (string | Date)[],
      errorMessage: string,
      usesToday: boolean,
      usesTomorrow: boolean
    ) => {
      describe(method, () => {
        it('should return tasks successfully', async () => {
          const mockResponse = createMockTasksResponse();
          mockedTaskRepository[repositoryMethod].mockResolvedValue(mockResponse);

          const result = await taskService[method]();

          expect(mockedGetUserId).toHaveBeenCalled();
          if (usesToday) expect(mockedStartOfToday).toHaveBeenCalled();
          if (usesTomorrow) expect(mockedStartOfTomorrow).toHaveBeenCalled();
          expect(mockedTaskRepository[repositoryMethod]).toHaveBeenCalledWith(...repositoryArgs);
          expect(result).toEqual(mockResponse);
        });

        it('should throw error when repository fails', async () => {
          mockedTaskRepository[repositoryMethod].mockRejectedValue(new Error('Database error'));

          await expect(taskService[method]()).rejects.toThrow(errorMessage);
        });
      });
    };

    testGetMethod(
      'getUpcomingTasks',
      'getUpcoming',
      [MOCK_TODAY_DATE, MOCK_USER_ID],
      'Failed to load upcoming tasks. Please try again.',
      true,
      false
    );

    testGetMethod(
      'getTodayTasks',
      'getToday',
      [MOCK_TODAY_DATE, MOCK_TOMORROW_DATE, MOCK_USER_ID],
      "Failed to load today's tasks. Please try again.",
      true,
      true
    );

    testGetMethod(
      'getInboxTasks',
      'getInbox',
      [MOCK_USER_ID],
      "Failed to load inbox's tasks. Please try again.",
      false,
      false
    );

    testGetMethod(
      'getCompletedTasks',
      'getCompleted',
      [MOCK_USER_ID],
      'Failed to load completed tasks. Please try again.',
      false,
      false
    );
  });

  describe('count methods', () => {
    describe('getInboxTaskCount', () => {
      it('should return inbox task count successfully', async () => {
        const expectedCount = 5;
        mockedTaskRepository.getInboxCountByUserId.mockResolvedValue(expectedCount);

        const result = await taskService.getInboxTaskCount();

        expect(mockedGetUserId).toHaveBeenCalled();
        expect(mockedTaskRepository.getInboxCountByUserId).toHaveBeenCalledWith(MOCK_USER_ID);
        expect(result).toBe(expectedCount);
      });

      it('should throw error when repository fails', async () => {
        mockedTaskRepository.getInboxCountByUserId.mockRejectedValue(new Error('Database error'));

        await expect(taskService.getInboxTaskCount()).rejects.toThrow('Failed to load inbox task count');
      });
    });

    describe('getTodayTaskCount', () => {
      it('should return today task count successfully', async () => {
        const expectedCount = 3;
        mockedTaskRepository.getTodayCountByUserId.mockResolvedValue(expectedCount);

        const result = await taskService.getTodayTaskCount();

        expect(mockedGetUserId).toHaveBeenCalled();
        expect(mockedStartOfToday).toHaveBeenCalled();
        expect(mockedStartOfTomorrow).toHaveBeenCalled();
        expect(mockedTaskRepository.getTodayCountByUserId).toHaveBeenCalledWith(
          MOCK_TODAY_DATE,
          MOCK_TOMORROW_DATE,
          MOCK_USER_ID
        );
        expect(result).toBe(expectedCount);
      });

      it('should throw error when repository fails', async () => {
        mockedTaskRepository.getTodayCountByUserId.mockRejectedValue(new Error('Database error'));

        await expect(taskService.getTodayTaskCount()).rejects.toThrow('Failed to load today task count');
      });
    });

    describe('getTaskCounts', () => {
      const mockErrorTestCases = [
        {
          scenario: 'inbox count fails',
          setupMocks: (mockedRepo: typeof mockedTaskRepository) => {
            mockedRepo.getInboxCountByUserId.mockRejectedValue(new Error('Inbox error'));
            mockedRepo.getTodayCountByUserId.mockResolvedValue(3);
          },
          expectedError: 'Failed to load inbox task count',
        },
        {
          scenario: 'today count fails',
          setupMocks: (mockedRepo: typeof mockedTaskRepository) => {
            mockedRepo.getInboxCountByUserId.mockResolvedValue(5);
            mockedRepo.getTodayCountByUserId.mockRejectedValue(new Error('Today error'));
          },
          expectedError: 'Failed to load today task count',
        },
      ];

      it('should return both inbox and today task counts successfully', async () => {
        const inboxCount = 5;
        const todayCount = 3;
        mockedTaskRepository.getInboxCountByUserId.mockResolvedValue(inboxCount);
        mockedTaskRepository.getTodayCountByUserId.mockResolvedValue(todayCount);

        const result = await taskService.getTaskCounts();

        expect(result).toEqual({ inboxTasks: inboxCount, todayTasks: todayCount });
      });

      it.each(mockErrorTestCases)('should propagate error when $scenario', async ({ setupMocks, expectedError }) => {
        setupMocks(mockedTaskRepository);

        await expect(taskService.getTaskCounts()).rejects.toThrow(expectedError);
      });
    });
  });

  describe('createTasksForProject', () => {
    const createMockAITasks = (): AIGeneratedTask[] => [
      { content: 'Task 1 content', due_date: new Date(), completed: false },
      { content: 'Task 2 content', due_date: null, completed: true },
    ];

    it('should create multiple tasks for project successfully', async () => {
      const mockAITasks = createMockAITasks();
      const mockCreatedTasks = [createMockTask(), createMockTask({ id: 'task-456' })];
      const mockGeneratedTasks = [
        {
          content: 'Task 1 content',
          due_date: mockAITasks[0].due_date,
          completed: false,
          projectId: MOCK_PROJECT_ID,
          userId: MOCK_USER_ID,
        },
        {
          content: 'Task 2 content',
          due_date: null,
          completed: true,
          projectId: MOCK_PROJECT_ID,
          userId: MOCK_USER_ID,
        },
      ];
      mockedTaskRepository.createMany.mockResolvedValue(mockCreatedTasks);

      const result = await taskService.createTasksForProject(MOCK_PROJECT_ID, mockAITasks);

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedTaskRepository.createMany).toHaveBeenCalledWith(mockGeneratedTasks);
      expect(result).toEqual(mockCreatedTasks);
    });

    it('should throw error when repository fails', async () => {
      const mockAITasks = createMockAITasks();
      mockedTaskRepository.createMany.mockRejectedValue(new Error('Database error'));

      await expect(taskService.createTasksForProject(MOCK_PROJECT_ID, mockAITasks)).rejects.toThrow(
        'Failed to create project tasks'
      );
    });
  });

  describe('createTask', () => {
    const MOCK_GENERATED_ID = 'generated-task-id';
    const createMockFormData = (overrides?: Partial<TaskFormInput>): TaskFormInput => ({
      content: 'New Task',
      due_date: new Date(),
      projectId: MOCK_PROJECT_ID,
      ...overrides,
    });

    it('should create task successfully with default completed status', async () => {
      const formData = createMockFormData();
      const mockTask = createMockTask();
      mockedGenerateID.mockReturnValue(MOCK_GENERATED_ID);
      mockedTaskRepository.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(formData);

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedGenerateID).toHaveBeenCalled();
      expect(mockedTaskRepository.create).toHaveBeenCalledWith(MOCK_GENERATED_ID, {
        content: formData.content,
        due_date: formData.due_date,
        completed: false,
        projectId: formData.projectId,
        userId: MOCK_USER_ID,
      });
      expect(result).toEqual(mockTask);
    });

    it('should create task with provided completed status', async () => {
      const formData = createMockFormData({ completed: true });
      const mockTask = createMockTask();
      mockedGenerateID.mockReturnValue(MOCK_GENERATED_ID);
      mockedTaskRepository.create.mockResolvedValue(mockTask);

      await taskService.createTask(formData);

      expect(mockedTaskRepository.create).toHaveBeenCalledWith(
        MOCK_GENERATED_ID,
        expect.objectContaining({ completed: true })
      );
    });

    it('should throw error when repository fails', async () => {
      const formData = createMockFormData();
      mockedGenerateID.mockReturnValue(MOCK_GENERATED_ID);
      mockedTaskRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(taskService.createTask(formData)).rejects.toThrow('Failed to create task');
    });
  });

  describe('updateTask', () => {
    const createUpdateData = () => ({
      content: 'Updated Task',
      due_date: new Date(),
      projectId: null,
    });

    it('should update task successfully', async () => {
      const updateData = createUpdateData();
      const updatedTask = createMockTask(updateData);
      mockedTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(MOCK_TASK_ID, updateData);

      expect(mockedTaskRepository.update).toHaveBeenCalledWith(MOCK_TASK_ID, updateData);
      expect(result).toEqual(updatedTask);
    });

    it('should throw error when repository fails', async () => {
      const updateData = createUpdateData();
      mockedTaskRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(taskService.updateTask(MOCK_TASK_ID, updateData)).rejects.toThrow('Failed to update task');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockedTaskRepository.delete.mockResolvedValue({});

      await taskService.deleteTask(MOCK_TASK_ID);

      expect(mockedTaskRepository.delete).toHaveBeenCalledWith(MOCK_TASK_ID);
    });

    it('should throw error when repository fails', async () => {
      mockedTaskRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(taskService.deleteTask(MOCK_TASK_ID)).rejects.toThrow('Failed to delete task');
    });
  });
});
