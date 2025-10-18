import { ROUTES } from '@/constants/routes';
import { aiService } from '@/services/ai/ai.service';
import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import type { ProjectEntity } from '@/types/projects.types';
import { AIGeneratedTask } from '@/types/tasks.types';
import { errorResponse, successResponse } from '@/utils/response/response.utils';
import { redirect } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { projectAction } from './project.action';

vi.mock('@/services/project/project.service', () => ({
  projectService: {
    getProjectById: vi.fn(),
    getUserProjects: vi.fn(),
    getRecentProjects: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  },
}));
vi.mock('@/services/ai/ai.service', () => ({
  aiService: {
    generateProjectTasks: vi.fn(),
  },
}));
vi.mock('@/services/task/task.service', () => ({
  taskService: {
    createTasksForProject: vi.fn(),
  },
}));
vi.mock('@/utils/response/response.utils', () => ({
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));
vi.mock('react-router', () => ({
  redirect: vi.fn(),
}));
vi.mock('@/constants/routes');

const mockedProjectService = vi.mocked(projectService);
const mockedAiService = vi.mocked(aiService);
const mockedTaskService = vi.mocked(taskService);
const mockedErrorResponse = vi.mocked(errorResponse);
const mockedSuccessResponse = vi.mocked(successResponse);
const mockedRedirect = vi.mocked(redirect);

describe('projectAction', () => {
  const createActionArgs = (request: Request) => ({
    request,
    params: {},
    context: {},
  });
  const createMockProject = (overrides: Partial<ProjectEntity> = {}): ProjectEntity => ({
    $id: 'project-1',
    name: 'Test Project',
    description: null,
    color: null,
    userId: 'user-123',
    color_name: 'slate',
    color_hex: '#6D8196',
    tasks: [],
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $collectionId: 'projects',
    $databaseId: 'default',
    $permissions: [],
    ...overrides,
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('POST request', () => {
    it('should create a project successfully without AI tasks', async () => {
      const mockProjectData = { name: 'Test Project' };
      const mockProject = createMockProject();
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockProjectData),
      });

      mockedProjectService.createProject.mockResolvedValue(mockProject);
      mockedRedirect.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedProjectService.createProject).toHaveBeenCalledWith(mockProjectData);
      expect(mockedAiService.generateProjectTasks).not.toHaveBeenCalled();
      expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.PROJECT('project-1'));
    });

    it('should create a project with AI tasks when enabled', async () => {
      const mockProjectData = {
        name: 'Test Project',
        ai_task_gen: true,
        task_gen_prompt: 'Create tasks',
      };
      const mockProject = createMockProject();
      const mockAiTasks: AIGeneratedTask[] = [
        {
          content: 'Task 1 content',
          due_date: new Date('2023-01-01'),
          completed: false,
        },
        {
          content: 'Task 2 content',
          due_date: new Date('2025-02-02'),
          completed: true,
        },
      ];
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockProjectData),
      });

      mockedProjectService.createProject.mockResolvedValue(mockProject);
      mockedAiService.generateProjectTasks.mockResolvedValue(mockAiTasks);
      mockedRedirect.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedProjectService.createProject).toHaveBeenCalledWith(mockProjectData);
      expect(mockedAiService.generateProjectTasks).toHaveBeenCalledWith('Create tasks');
      expect(mockedTaskService.createTasksForProject).toHaveBeenCalledWith('project-1', mockAiTasks);
      expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.PROJECT('project-1'));
    });

    it('should not create AI tasks when prompt is empty', async () => {
      const mockProjectData = {
        name: 'Test Project',
        ai_task_gen: true,
        task_gen_prompt: '',
      };
      const mockProject = createMockProject();
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockProjectData),
      });

      mockedProjectService.createProject.mockResolvedValue(mockProject);
      mockedRedirect.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedProjectService.createProject).toHaveBeenCalledWith(mockProjectData);
      expect(mockedAiService.generateProjectTasks).not.toHaveBeenCalled();
      expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.PROJECT('project-1'));
    });

    it('should return error when name is missing', async () => {
      const mockProjectData = { name: '' };
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockProjectData),
      });

      mockedErrorResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Project name is required', 400);
      expect(mockedProjectService.createProject).not.toHaveBeenCalled();
    });
  });

  describe('PUT request', () => {
    it('should update a project successfully', async () => {
      const mockProjectData = { id: 'project-1', name: 'Updated Project' };
      const mockProject = createMockProject({ name: 'Updated Project' });
      const mockRequest = new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(mockProjectData),
      });

      mockedProjectService.updateProject.mockResolvedValue(mockProject);
      mockedSuccessResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedProjectService.updateProject).toHaveBeenCalledWith('project-1', { name: 'Updated Project' });
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Project updated successfully', { project: mockProject });
    });

    it('should return error when ID is missing', async () => {
      const mockProjectData = { name: 'Updated Project' };
      const mockRequest = new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(mockProjectData),
      });

      mockedErrorResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Project ID is required', 400);
      expect(mockedProjectService.updateProject).not.toHaveBeenCalled();
    });
  });

  describe('DELETE request', () => {
    it('should delete a project successfully', async () => {
      const mockProjectData = { id: 'project-1' };
      const mockRequest = new Request('http://localhost', {
        method: 'DELETE',
        body: JSON.stringify(mockProjectData),
      });

      mockedProjectService.deleteProject.mockResolvedValue();
      mockedSuccessResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedProjectService.deleteProject).toHaveBeenCalledWith('project-1');
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Project deleted successfully');
    });

    it('should return error when ID is missing', async () => {
      const mockProjectData = {};
      const mockRequest = new Request('http://localhost', {
        method: 'DELETE',
        body: JSON.stringify(mockProjectData),
      });

      mockedErrorResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Project ID is required', 400);
      expect(mockedProjectService.deleteProject).not.toHaveBeenCalled();
    });
  });

  describe('Invalid method', () => {
    it('should return method not allowed for unsupported HTTP method', async () => {
      const mockRequest = new Request('http://localhost', {
        method: 'PATCH',
      });

      mockedErrorResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Method not allowed', 405);
    });
  });

  describe('Error handling', () => {
    it('should return error response when service throws error', async () => {
      const mockProjectData = { name: 'Test Project' };
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockProjectData),
      });

      const mockError = new Error('Database error');
      mockedProjectService.createProject.mockRejectedValue(mockError);
      mockedErrorResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Database error', 500);
    });

    it('should return generic error message for non-Error objects', async () => {
      const mockProjectData = { name: 'Test Project' };
      const mockRequest = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(mockProjectData),
      });

      mockedProjectService.createProject.mockRejectedValue('String error');
      mockedErrorResponse.mockReturnValue({} as Response);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Failed to process request', 500);
    });
  });
});
