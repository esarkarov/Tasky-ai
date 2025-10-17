import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectsLoader } from './projects.loader';
import { projectService } from '@/services/project/project.service';
import type { ProjectsListResponse } from '@/types/projects.types';
import type { ProjectsLoaderData } from '@/types/loaders.types';

vi.mock('@/services/project/project.service');

const mockedProjectService = vi.mocked(projectService);

describe('projectsLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createLoaderArgs = (url: string = 'http://localhost') => ({
    request: new Request(url),
    params: {},
    context: {},
  });

  describe('search query handling', () => {
    it('should return projects with search query', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 1,
        documents: [
          {
            $id: 'project-1',
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

      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs('http://localhost?q=test'))) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('test');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('should handle empty search query', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 2,
        documents: [
          {
            $id: 'project-1',
            $collectionId: 'projects',
            $databaseId: '34sdfd',
            $permissions: [],
            $updatedAt: '2025-10-11T12:26:15.675+00:00',
            name: 'React Fiber Tree',
            color_name: 'Slate',
            color_hex: '#64748b',
            $createdAt: '2025-10-11T12:26:15.675+00:00',
          },
        ],
      };

      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs())) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('should handle search query with special characters', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 1,
        documents: [],
      };

      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs('http://localhost?q=react+node'))) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('react node');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('should handle multiple query parameters', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 1,
        documents: [],
      };

      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(
        createLoaderArgs('http://localhost?q=test&sort=name&page=1')
      )) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('test');
      expect(result).toEqual({ projects: mockProjects });
    });

    it('should handle URL with hash and query parameters', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 1,
        documents: [],
      };

      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(
        createLoaderArgs('http://localhost?q=search#section')
      )) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('search');
      expect(result).toEqual({ projects: mockProjects });
    });
  });

  describe('when no projects exist', () => {
    it('should return empty projects array', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 0,
        documents: [],
      };

      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs())) as ProjectsLoaderData;

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('');
      expect(result).toEqual({ projects: mockProjects });
      expect(result.projects.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors', async () => {
      mockedProjectService.getUserProjects.mockRejectedValue(new Error('Service error'));

      await expect(projectsLoader(createLoaderArgs())).rejects.toThrow('Service error');

      expect(mockedProjectService.getUserProjects).toHaveBeenCalledWith('');
    });
  });

  describe('data structure validation', () => {
    it('should return correct ProjectsLoaderData structure', async () => {
      const mockProjects: ProjectsListResponse = {
        total: 1,
        documents: [
          {
            $id: 'project-1',
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

      mockedProjectService.getUserProjects.mockResolvedValue(mockProjects);

      const result = (await projectsLoader(createLoaderArgs())) as ProjectsLoaderData;

      expect(result).toHaveProperty('projects');
      expect(result.projects).toHaveProperty('total');
      expect(result.projects).toHaveProperty('documents');
      expect(result.projects.total).toBe(1);
      expect(result.projects.documents).toHaveLength(1);
    });
  });
});
