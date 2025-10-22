import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectsLoader } from './projects.loader';
import { projectService } from '@/services/project/project.service';
import type { ProjectsListResponse } from '@/types/projects.types';
import type { ProjectsLoaderData } from '@/types/loaders.types';

vi.mock('@/services/project/project.service', () => ({
  projectService: {
    getUserProjects: vi.fn(),
  },
}));

const mockedProjectService = vi.mocked(projectService);

const createLoaderArgs = (url: string = 'http://localhost') => ({
  request: new Request(url),
  params: {},
  context: {},
});

const createMockProjects = (overrides?: Partial<ProjectsListResponse>): ProjectsListResponse => ({
  total: 1,
  documents: [
    {
      $id: 'project-1',
      $collectionId: 'projects',
      $databaseId: '34sdfd',
      $permissions: [],
      $updatedAt: '2025-10-11T12:26:15.675+00:00',
      $createdAt: '2025-10-11T12:26:15.675+00:00',
      name: 'React performance optimization',
      color_name: 'Slate',
      color_hex: '#64748b',
    },
  ],
  ...overrides,
});

describe('projectsLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('with search queries', () => {
    it('returns projects when search query is present', async () => {
      const mockProjects = createMockProjects();
      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs('http://localhost?q=test'))) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('test');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('handles empty search query', async () => {
      const mockProjects = createMockProjects({ total: 2 });
      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs())) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('handles special characters in query', async () => {
      const mockProjects = createMockProjects({ documents: [] });
      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs('http://localhost?q=react+node'))) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('react node');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('handles multiple query parameters', async () => {
      const mockProjects = createMockProjects({ documents: [] });
      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(
        createLoaderArgs('http://localhost?q=test&sort=name&page=1')
      )) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('test');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('handles URL with hash and query', async () => {
      const mockProjects = createMockProjects({ documents: [] });
      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(
        createLoaderArgs('http://localhost?q=search#section')
      )) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('search');
      expect(result).toEqual({ projects: mockProjects });
    });
  });

  describe('when no projects exist', () => {
    it('returns an empty project list', async () => {
      const mockProjects = createMockProjects({ total: 0, documents: [] });
      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs())) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('');
      expect(result).toEqual({ projects: mockProjects });
      expect(result.projects.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws when service fails', async () => {
      mockedProjectService.getUserProjects.mockRejectedValue(new Error('Service error'));

      await expect(projectsLoader(createLoaderArgs())).rejects.toThrow('Service error');
      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('');
    });
  });

  describe('data validation', () => {
    it('returns valid ProjectsLoaderData structure', async () => {
      const mockProjects = createMockProjects();
      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs())) as ProjectsLoaderData;

      expect(result).toHaveProperty('projects');
      expect(result.projects).toHaveProperty('total', 1);
      expect(result.projects.documents).toHaveLength(1);
    });
  });
});
