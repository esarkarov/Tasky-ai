import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appLoader } from './app.loader';
import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import { getUserId } from '@/utils/auth/auth.utils';
import { redirect } from 'react-router';
import { ROUTES } from '@/constants/routes';
import type { TaskCounts } from '@/types/tasks.types';
import type { ProjectsListResponse } from '@/types/projects.types';

vi.mock('@/services/project/project.service');
vi.mock('@/services/task/task.service');
vi.mock('@/utils/auth/auth.utils');
vi.mock('react-router');
vi.mock('@/constants/routes');

const mockedProjectService = vi.mocked(projectService);
const mockedTaskService = vi.mocked(taskService);
const mockedGetUserId = vi.mocked(getUserId);
const mockedRedirect = vi.mocked(redirect);

describe('appLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createLoaderArgs = () => ({
    request: new Request('http://localhost'),
    params: {},
    context: {},
  });

  describe('when user is not authenticated', () => {
    it('should redirect to login page when userId is empty string', async () => {
      mockedGetUserId.mockReturnValue('');
      mockedRedirect.mockReturnValue({} as Response);

      const result = await appLoader(createLoaderArgs());

      expect(mockedGetUserId).toHaveBeenCalledOnce();
      expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.LOGIN);
      expect(result).toEqual({} as Response);
    });
  });

  describe('when user is authenticated', () => {
    it('should return projects and task counts', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 1,
        documents: [
          {
            $id: '123123',
            $collectionId: 'projects',
            $databaseId: '34sdfd',
            $permissions: [],
            $updatedAt: '2025-10-11T12:26:15.675+00:00',
            name: 'React performance optimization',
            color_name: 'Slate',
            color_hex: '#64748b',
            $createdAt: '2025-10-11T12:26:15.675+00:00',
          },
        ],
      };
      const mockTaskCounts: TaskCounts = { todayTasks: 5, inboxTasks: 2 };

      mockedGetUserId.mockReturnValue('user-123');
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
      const mockProjects: ProjectsListResponse = {
        total: 0,
        documents: [],
      };
      const mockTaskCounts: TaskCounts = { todayTasks: 0, inboxTasks: 0 };

      mockedGetUserId.mockReturnValue('user-123');
      mockedProjectService.getRecentProjects.mockResolvedValue(mockProjects);
      mockedTaskService.getTaskCounts.mockResolvedValue(mockTaskCounts);

      const result = await appLoader(createLoaderArgs());

      expect(result).toEqual({
        projects: mockProjects,
        taskCounts: mockTaskCounts,
      });
    });

    it('should handle project service errors gracefully', async () => {
      mockedGetUserId.mockReturnValue('user-123');
      mockedProjectService.getRecentProjects.mockRejectedValue(new Error('Project service error'));

      await expect(appLoader(createLoaderArgs())).rejects.toThrow('Project service error');
      expect(mockedGetUserId).toHaveBeenCalledOnce();
      expect(mockedProjectService.getRecentProjects).toHaveBeenCalledOnce();
    });

    it('should handle task service errors gracefully', async () => {
      mockedGetUserId.mockReturnValue('user-123');
      mockedTaskService.getTaskCounts.mockRejectedValue(new Error('Task service error'));

      await expect(appLoader(createLoaderArgs())).rejects.toThrow('Task service error');
      expect(mockedGetUserId).toHaveBeenCalledOnce();
      expect(mockedTaskService.getTaskCounts).toHaveBeenCalledOnce();
    });

    it('should handle both services failing', async () => {
      mockedGetUserId.mockReturnValue('user-123');
      mockedProjectService.getRecentProjects.mockRejectedValue(new Error('Project service failed'));
      mockedTaskService.getTaskCounts.mockRejectedValue(new Error('Task service failed'));

      await expect(appLoader(createLoaderArgs())).rejects.toThrow('Project service failed');
      expect(mockedGetUserId).toHaveBeenCalledOnce();
    });

    it('should use Promise all() method for concurrent service calls', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 1,
        documents: [
          {
            $id: '123123',
            $collectionId: 'projects',
            $databaseId: '34sdfd',
            $permissions: [],
            $updatedAt: '2025-10-11T12:26:15.675+00:00',
            name: 'Test Project',
            color_name: 'Slate',
            color_hex: '#64748b',
            $createdAt: '2025-10-11T12:26:15.675+00:00',
          },
        ],
      };
      const mockTaskCounts: TaskCounts = { todayTasks: 3, inboxTasks: 1 };

      mockedGetUserId.mockReturnValue('user-123');
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
