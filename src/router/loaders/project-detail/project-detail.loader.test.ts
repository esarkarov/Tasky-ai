import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectDetailLoader } from './project-detail.loader';
import { projectService } from '@/services/project/project.service';
import type { ProjectEntity } from '@/types/projects.types';
import { ProjectDetailLoaderData } from '@/types/loaders.types';

vi.mock('@/services/project/project.service', () => ({
  projectService: {
    getProjectById: vi.fn(),
  },
}));

const mockedProjectService = vi.mocked(projectService);

describe('projectDetailLoader', () => {
  const MOCK_PROJECT_ID = 'project-123';
  const MOCK_USER_ID = 'user-123';

  const createLoaderArgs = (projectId?: string) => ({
    params: { projectId },
    request: new Request('http://localhost'),
    context: {},
  });

  const createMockProject = (overrides?: Partial<ProjectEntity>): ProjectEntity => ({
    $id: MOCK_PROJECT_ID,
    name: 'Test Project',
    description: 'Test description',
    color: 'blue',
    userId: MOCK_USER_ID,
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when project exists', () => {
    it('should return project data', async () => {
      const mockProject = createMockProject();
      mockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const result = await projectDetailLoader(createLoaderArgs(MOCK_PROJECT_ID));

      expect(mockedProjectService.getProjectById).toHaveBeenCalledWith(MOCK_PROJECT_ID);
      expect(result).toEqual({ project: mockProject });
    });

    it('should handle different project IDs', async () => {
      const differentProjectId = 'different-project';
      const mockProject = createMockProject({ $id: differentProjectId });
      mockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const result = await projectDetailLoader(createLoaderArgs(differentProjectId));

      expect(mockedProjectService.getProjectById).toHaveBeenCalledWith(differentProjectId);
      expect(result).toEqual({ project: mockProject });
    });

    it('should return correct data structure with project details', async () => {
      const mockProject = createMockProject();
      mockedProjectService.getProjectById.mockResolvedValue(mockProject);

      const result = (await projectDetailLoader(createLoaderArgs(MOCK_PROJECT_ID))) as ProjectDetailLoaderData;

      expect(result).toHaveProperty('project');
      expect(result.project).toEqual(mockProject);
      expect(result.project.$id).toBe(MOCK_PROJECT_ID);
      expect(result.project.name).toBe('Test Project');
    });
  });

  describe('error handling', () => {
    const mockProjectPermissions = [
      { scenario: 'not found', error: 'Project not found', projectId: 'invalid-id' },
      { scenario: 'permission denied', error: 'Access denied', projectId: 'restricted-project' },
    ];
    const mockMissingProjectId = [
      { scenario: 'undefined', projectId: undefined },
      { scenario: 'not provided', projectId: undefined as string | undefined },
    ];

    it.each(mockProjectPermissions)('should propagate $scenario errors', async ({ error, projectId }) => {
      mockedProjectService.getProjectById.mockRejectedValue(new Error(error));

      await expect(projectDetailLoader(createLoaderArgs(projectId))).rejects.toThrow(error);
      expect(mockedProjectService.getProjectById).toHaveBeenCalledWith(projectId);
    });

    it.each(mockMissingProjectId)('should throw error when projectId is $scenario', async ({ projectId }) => {
      mockedProjectService.getProjectById.mockRejectedValue(new Error('Project ID is required'));

      await expect(projectDetailLoader(createLoaderArgs(projectId))).rejects.toThrow('Project ID is required');
    });
  });
});
