import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectDetailLoader } from './project-detail.loader';
import { projectService } from '@/services/project/project.service';
import type { ProjectEntity } from '@/types/projects.types';
import type { ProjectDetailLoaderData } from '@/types/loaders.types';

vi.mock('@/services/project/project.service');

const mockedProjectService = vi.mocked(projectService);

describe('projectDetailLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createLoaderArgs = (params: { projectId?: string } = {}) => ({
    params,
    request: new Request('http://localhost'),
    context: {},
  });

  const createMockProject = (overrides: Partial<ProjectEntity> = {}): ProjectEntity => ({
    $id: 'project-123',
    name: 'Test Project',
    description: 'Test description',
    color: 'blue',
    userId: 'user-123',
    color_name: 'blue',
    color_hex: '#0000FF',
    tasks: [],
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $collectionId: 'projects',
    $databaseId: 'default',
    $permissions: [],
    ...overrides,
  });

  describe('when project exists', () => {
    it('should return project data with correct project ID', async () => {
      const mockProject = createMockProject();
      mockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const result = await projectDetailLoader(createLoaderArgs({ projectId: 'project-123' }));

      expect(mockedProjectService.getProjectById).toHaveBeenCalledWith('project-123');
      expect(result).toEqual({ project: mockProject });
    });

    it('should handle different project IDs correctly', async () => {
      const mockProject = createMockProject({ $id: 'different-project' });
      mockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const result = await projectDetailLoader(createLoaderArgs({ projectId: 'different-project' }));

      expect(mockedProjectService.getProjectById).toHaveBeenCalledWith('different-project');
      expect(result).toEqual({ project: mockProject });
    });
  });

  describe('when project service throws error', () => {
    it('should propagate "not found" errors', async () => {
      mockedProjectService.getProjectById.mockRejectedValue(new Error('Project not found'));

      await expect(projectDetailLoader(createLoaderArgs({ projectId: 'invalid-id' }))).rejects.toThrow(
        'Project not found'
      );

      expect(mockedProjectService.getProjectById).toHaveBeenCalledWith('invalid-id');
    });

    it('should propagate permission errors', async () => {
      mockedProjectService.getProjectById.mockRejectedValue(new Error('Access denied'));

      await expect(projectDetailLoader(createLoaderArgs({ projectId: 'restricted-project' }))).rejects.toThrow(
        'Access denied'
      );
    });
  });

  describe('when projectId is missing from params', () => {
    it('should throw an error when params is empty', async () => {
      mockedProjectService.getProjectById.mockRejectedValue(new Error('Project ID is required'));

      await expect(projectDetailLoader(createLoaderArgs())).rejects.toThrow('Project ID is required');
    });

    it('should throw an error when projectId is undefined', async () => {
      mockedProjectService.getProjectById.mockRejectedValue(new Error('Project ID is required'));

      await expect(projectDetailLoader(createLoaderArgs({ projectId: undefined }))).rejects.toThrow(
        'Project ID is required'
      );
    });
  });

  describe('data structure validation', () => {
    it('should return correct ProjectDetailLoaderData structure', async () => {
      const mockProject = createMockProject();
      mockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const result = (await projectDetailLoader(
        createLoaderArgs({ projectId: 'project-123' })
      )) as ProjectDetailLoaderData;

      expect(result).toHaveProperty('project');
      expect(result.project).toEqual(mockProject);
      expect(result.project.$id).toBe('project-123');
      expect(result.project.name).toBe('Test Project');
    });
  });
});
