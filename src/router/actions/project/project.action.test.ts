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
  const MOCK_PROJECT_ID = 'project-1';
  const MOCK_USER_ID = 'user-123';
  const BASE_URL = 'http://localhost';

  const createActionArgs = (request: Request) => ({
    request,
    params: {},
    context: {},
  });

  const createMockRequest = (method: string, body?: object) => {
    const options: RequestInit = { method };
    if (body) {
      options.body = JSON.stringify(body);
    }
    return new Request(BASE_URL, options);
  };

  const createMockProject = (overrides?: Partial<ProjectEntity>): ProjectEntity => ({
    $id: MOCK_PROJECT_ID,
    name: 'Test Project',
    description: null,
    color: null,
    userId: MOCK_USER_ID,
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

  const createMockAITasks = (): AIGeneratedTask[] => [
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockedRedirect.mockReturnValue({} as Response);
    mockedErrorResponse.mockReturnValue({} as Response);
    mockedSuccessResponse.mockReturnValue({} as Response);
  });

  describe('POST request', () => {
    describe('without AI task generation', () => {
      it('should create project successfully', async () => {
        const projectData = { name: 'Test Project' };
        const mockProject = createMockProject();
        const mockRequest = createMockRequest('POST', projectData);
        mockedProjectService.createProject.mockResolvedValue(mockProject);

        await projectAction(createActionArgs(mockRequest));

        expect(mockedProjectService.createProject).toHaveBeenCalledWith(projectData);
        expect(mockedAiService.generateProjectTasks).not.toHaveBeenCalled();
        expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.PROJECT(MOCK_PROJECT_ID));
      });

      it('should not generate AI tasks when prompt is empty', async () => {
        const projectData = {
          name: 'Test Project',
          ai_task_gen: true,
          task_gen_prompt: '',
        };
        const mockProject = createMockProject();
        const mockRequest = createMockRequest('POST', projectData);
        mockedProjectService.createProject.mockResolvedValue(mockProject);

        await projectAction(createActionArgs(mockRequest));

        expect(mockedProjectService.createProject).toHaveBeenCalledWith(projectData);
        expect(mockedAiService.generateProjectTasks).not.toHaveBeenCalled();
        expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.PROJECT(MOCK_PROJECT_ID));
      });
    });

    describe('with AI task generation', () => {
      it('should create project and generate AI tasks', async () => {
        const projectData = {
          name: 'Test Project',
          ai_task_gen: true,
          task_gen_prompt: 'Create tasks',
        };
        const mockProject = createMockProject();
        const mockAiTasks = createMockAITasks();
        const mockRequest = createMockRequest('POST', projectData);
        mockedProjectService.createProject.mockResolvedValue(mockProject);
        mockedAiService.generateProjectTasks.mockResolvedValue(mockAiTasks);

        await projectAction(createActionArgs(mockRequest));

        expect(mockedProjectService.createProject).toHaveBeenCalledWith(projectData);
        expect(mockedAiService.generateProjectTasks).toHaveBeenCalledWith('Create tasks');
        expect(mockedTaskService.createTasksForProject).toHaveBeenCalledWith(MOCK_PROJECT_ID, mockAiTasks);
        expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.PROJECT(MOCK_PROJECT_ID));
      });
    });

    describe('validation', () => {
      it('should return error when name is missing', async () => {
        const projectData = { name: '' };
        const mockRequest = createMockRequest('POST', projectData);

        await projectAction(createActionArgs(mockRequest));

        expect(mockedErrorResponse).toHaveBeenCalledWith('Project name is required', 400);
        expect(mockedProjectService.createProject).not.toHaveBeenCalled();
      });
    });
  });

  describe('PUT request', () => {
    it('should update project successfully', async () => {
      const projectData = { id: MOCK_PROJECT_ID, name: 'Updated Project' };
      const mockProject = createMockProject({ name: 'Updated Project' });
      const mockRequest = createMockRequest('PUT', projectData);
      mockedProjectService.updateProject.mockResolvedValue(mockProject);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedProjectService.updateProject).toHaveBeenCalledWith(MOCK_PROJECT_ID, { name: 'Updated Project' });
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Project updated successfully', { project: mockProject });
    });

    it('should return error when ID is missing', async () => {
      const projectData = { name: 'Updated Project' };
      const mockRequest = createMockRequest('PUT', projectData);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Project ID is required', 400);
      expect(mockedProjectService.updateProject).not.toHaveBeenCalled();
    });
  });

  describe('DELETE request', () => {
    it('should delete project successfully', async () => {
      const projectData = { id: MOCK_PROJECT_ID };
      const mockRequest = createMockRequest('DELETE', projectData);
      mockedProjectService.deleteProject.mockResolvedValue();

      await projectAction(createActionArgs(mockRequest));

      expect(mockedProjectService.deleteProject).toHaveBeenCalledWith(MOCK_PROJECT_ID);
      expect(mockedSuccessResponse).toHaveBeenCalledWith('Project deleted successfully');
    });

    it('should return error when ID is missing', async () => {
      const projectData = {};
      const mockRequest = createMockRequest('DELETE', projectData);

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Project ID is required', 400);
      expect(mockedProjectService.deleteProject).not.toHaveBeenCalled();
    });
  });

  describe('unsupported methods', () => {
    it('should return method not allowed for PATCH request', async () => {
      const mockRequest = createMockRequest('PATCH');

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Method not allowed', 405);
    });
  });

  describe('error handling', () => {
    it('should return error response when service throws Error', async () => {
      const projectData = { name: 'Test Project' };
      const mockRequest = createMockRequest('POST', projectData);
      mockedProjectService.createProject.mockRejectedValue(new Error('Database error'));

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Database error', 500);
    });

    it('should return generic error for non-Error objects', async () => {
      const projectData = { name: 'Test Project' };
      const mockRequest = createMockRequest('POST', projectData);
      mockedProjectService.createProject.mockRejectedValue('String error');

      await projectAction(createActionArgs(mockRequest));

      expect(mockedErrorResponse).toHaveBeenCalledWith('Failed to process request', 500);
    });
  });
});
