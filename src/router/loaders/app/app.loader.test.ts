import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appLoader } from './app.loader';
import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import { getUserId } from '@/utils/auth/auth.utils';
import { redirect } from 'react-router';
import { ROUTES } from '@/constants/routes';
import type { TaskCounts } from '@/types/tasks.types';
import type { ProjectsListResponse, ProjectListItem } from '@/types/projects.types';

vi.mock('@/services/project/project.service', () => ({
  projectService: {
    getRecentProjects: vi.fn(),
  },
}));
vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getTaskCounts: vi.fn(),
  },
}));
vi.mock('react-router', () => ({
  redirect: vi.fn(),
}));
vi.mock('@/utils/auth/auth.utils', () => ({
  getUserId: vi.fn(),
}));
vi.mock('@/constants/routes');

const mockedProjectService = vi.mocked(projectService);
const mockedTaskService = vi.mocked(taskService);
const mockedGetUserId = vi.mocked(getUserId);
const mockedRedirect = vi.mocked(redirect);

describe('appLoader', () => {
  const MOCK_USER_ID = 'user-123';

  const createLoaderArgs = () => ({
    request: new Request('http://localhost'),
    params: {},
    context: {},
  });

  const createMockProjectListItem = (overrides?: Partial<ProjectListItem>): ProjectListItem => ({
    $id: '123123',
    $collectionId: 'projects',
    $databaseId: '34sdfd',
    $permissions: [],
    $updatedAt: '2025-10-11T12:26:15.675+00:00',
    name: 'Test Project',
    color_name: 'Slate',
    color_hex: '#64748b',
    $createdAt: '2025-10-11T12:26:15.675+00:00',
    ...overrides,
  });

  const createMockProjectsResponse = (
    items: ProjectListItem[] = [createMockProjectListItem()]
  ): ProjectsListResponse => ({
    total: items.length,
    documents: items,
  });

  const createMockTaskCounts = (todayTasks = 5, inboxTasks = 2): TaskCounts => ({
    todayTasks,
    inboxTasks,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is not authenticated', () => {
    it('should redirect to login page', async () => {
      mockedGetUserId.mockReturnValue('');
      mockedRedirect.mockReturnValue({} as Response);

      const result = await appLoader(createLoaderArgs());

      expect(mockedGetUserId).toHaveBeenCalledOnce();
      expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.LOGIN);
      expect(result).toEqual({} as Response);
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockedGetUserId.mockReturnValue(MOCK_USER_ID);
    });

    it('should return projects and task counts', async () => {
      const mockProjects = createMockProjectsResponse([
        createMockProjectListItem({ name: 'React performance optimization' }),
      ]);
      const mockTaskCounts = createMockTaskCounts();
      mockedProjectService.getRecentProjects.mockResolvedValue(mockProjects);
      mockedTaskService.getTaskCounts.mockResolvedValue(mockTaskCounts);

      const result = await appLoader(createLoaderArgs());

      expect(mockedGetUserId).toHaveBeenCalledOnce();
      expect(mockedProjectService.getRecentProjects).toHaveBeenCalledOnce();
      expect(mockedTaskService.getTaskCounts).toHaveBeenCalledOnce();
      expect(result).toEqual({
        projects: mockProjects,
        taskCounts: mockTaskCounts,
      });
    });

    it('should handle empty projects and task counts', async () => {
      const mockProjects = createMockProjectsResponse([]);
      const mockTaskCounts = createMockTaskCounts(0, 0);
      mockedProjectService.getRecentProjects.mockResolvedValue(mockProjects);
      mockedTaskService.getTaskCounts.mockResolvedValue(mockTaskCounts);

      const result = await appLoader(createLoaderArgs());

      expect(result).toEqual({
        projects: mockProjects,
        taskCounts: mockTaskCounts,
      });
    });

    describe('error handling', () => {
      it('should propagate project service errors', async () => {
        const error = new Error('Project service error');
        mockedProjectService.getRecentProjects.mockRejectedValue(error);

        await expect(appLoader(createLoaderArgs())).rejects.toThrow('Project service error');
        expect(mockedGetUserId).toHaveBeenCalledOnce();
        expect(mockedProjectService.getRecentProjects).toHaveBeenCalledOnce();
      });

      it('should propagate task service errors', async () => {
        const mockProjects = createMockProjectsResponse();
        mockedProjectService.getRecentProjects.mockResolvedValue(mockProjects);
        mockedTaskService.getTaskCounts.mockRejectedValue(new Error('Task service error'));

        await expect(appLoader(createLoaderArgs())).rejects.toThrow('Task service error');
        expect(mockedGetUserId).toHaveBeenCalledOnce();
        expect(mockedTaskService.getTaskCounts).toHaveBeenCalledOnce();
      });

      it('should propagate first error when both services fail', async () => {
        mockedProjectService.getRecentProjects.mockRejectedValue(new Error('Project service failed'));
        mockedTaskService.getTaskCounts.mockRejectedValue(new Error('Task service failed'));

        await expect(appLoader(createLoaderArgs())).rejects.toThrow('Project service failed');
        expect(mockedGetUserId).toHaveBeenCalledOnce();
      });
    });

    it('should make concurrent service calls', async () => {
      const mockProjects = createMockProjectsResponse();
      const mockTaskCounts = createMockTaskCounts(3, 1);
      mockedProjectService.getRecentProjects.mockResolvedValue(mockProjects);
      mockedTaskService.getTaskCounts.mockResolvedValue(mockTaskCounts);

      const result = await appLoader(createLoaderArgs());

      expect(mockedProjectService.getRecentProjects).toHaveBeenCalledOnce();
      expect(mockedTaskService.getTaskCounts).toHaveBeenCalledOnce();
      expect(result).toEqual({
        projects: mockProjects,
        taskCounts: mockTaskCounts,
      });
    });
  });
});
