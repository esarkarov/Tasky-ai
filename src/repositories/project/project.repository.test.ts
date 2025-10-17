import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectRepository } from './project.repository';
import { databases } from '@/lib/appwrite';
import { env } from '@/config/env.config';
import { projectQueries } from '@/queries/project/project.queries';
import { Project, ProjectsListResponse, ProjectCreateData, ProjectUpdateData } from '@/types/projects.types';

vi.mock('@/lib/appwrite', () => ({
  databases: {
    getDocument: vi.fn(),
    listDocuments: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));
vi.mock('@/config/env.config', () => ({
  env: {
    appwriteDatabaseId: 'test-database',
    appwriteProjectsCollectionId: 'test-projects',
  },
}));
vi.mock('@/queries/project/project.queries', () => ({
  projectQueries: {
    selectListFields: vi.fn(),
    byUserId: vi.fn(),
    searchByName: vi.fn(),
    orderByCreatedDesc: vi.fn(),
    limit: vi.fn(),
    userProjects: vi.fn(),
  },
}));

const mockedDatabases = vi.mocked(databases);
const mockedEnv = vi.mocked(env);
const mockedProjectQueries = vi.mocked(projectQueries);

describe('projectRepository', () => {
  const mockDatabaseId = 'test-database';
  const mockCollectionId = 'test-projects';
  const mockProjectId = 'project-123';
  const mockUserId = 'user-123';
  const mockProject: Project = {
    $id: mockProjectId,
    userId: mockUserId,
    name: 'Test Project',
    color_name: 'blue',
    color_hex: '#0000FF',
    tasks: [],
    $createdAt: '',
    $updatedAt: '',
    $permissions: [],
    $databaseId: '',
    $collectionId: '',
  };
  const mockProjectsResponse: ProjectsListResponse = {
    documents: [
      {
        $id: mockProjectId,
        name: 'Test Project',
        color_name: 'blue',
        color_hex: '#0000FF',
        $createdAt: '2023-01-01',
        $updatedAt: '',
        $permissions: [],
        $databaseId: '',
        $collectionId: '',
      },
    ],
    total: 1,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockedEnv.appwriteDatabaseId = mockDatabaseId;
    mockedEnv.appwriteProjectsCollectionId = mockCollectionId;
  });

  describe('findById', () => {
    it('should return project when found successfully', async () => {
      mockedDatabases.getDocument.mockResolvedValue(mockProject);

      const result = await projectRepository.findById(mockProjectId);

      expect(mockedDatabases.getDocument).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockProjectId);
      expect(result).toEqual(mockProject);
    });

    it('should propagate error when getDocument fails', async () => {
      mockedDatabases.getDocument.mockRejectedValue(new Error('Document not found'));

      await expect(projectRepository.findById(mockProjectId)).rejects.toThrow('Document not found');
    });
  });

  describe('listByUserId', () => {
    it('should return user projects with search query', async () => {
      const searchQuery = 'test';
      const mockQueries = ['query1', 'query2'];
      mockedProjectQueries.userProjects.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue(mockProjectsResponse);

      const result = await projectRepository.listByUserId(mockUserId, { search: searchQuery });

      expect(mockedProjectQueries.userProjects).toHaveBeenCalledWith(mockUserId, { search: searchQuery });
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should return user projects with limit', async () => {
      const limit = 5;
      const mockQueries = ['query1', 'query2'];
      mockedProjectQueries.userProjects.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue(mockProjectsResponse);

      const result = await projectRepository.listByUserId(mockUserId, { limit });

      expect(mockedProjectQueries.userProjects).toHaveBeenCalledWith(mockUserId, { limit });
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should return user projects without options', async () => {
      const mockQueries = ['query1', 'query2'];
      mockedProjectQueries.userProjects.mockReturnValue(mockQueries);
      mockedDatabases.listDocuments.mockResolvedValue(mockProjectsResponse);

      const result = await projectRepository.listByUserId(mockUserId);

      expect(mockedProjectQueries.userProjects).toHaveBeenCalledWith(mockUserId, undefined);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockQueries);
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should propagate error when listDocuments fails', async () => {
      mockedProjectQueries.userProjects.mockReturnValue([]);
      mockedDatabases.listDocuments.mockRejectedValue(new Error('Query failed'));

      await expect(projectRepository.listByUserId(mockUserId)).rejects.toThrow('Query failed');
    });
  });

  describe('create', () => {
    const mockCreateData: ProjectCreateData = {
      name: 'New Project',
      color_name: 'red',
      color_hex: '#FF0000',
      userId: mockUserId,
    };

    it('should create project successfully', async () => {
      mockedDatabases.createDocument.mockResolvedValue(mockProject);

      const result = await projectRepository.create(mockProjectId, mockCreateData);

      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        mockDatabaseId,
        mockCollectionId,
        mockProjectId,
        mockCreateData
      );
      expect(result).toEqual(mockProject);
    });

    it('should propagate error when createDocument fails', async () => {
      mockedDatabases.createDocument.mockRejectedValue(new Error('Create failed'));

      await expect(projectRepository.create(mockProjectId, mockCreateData)).rejects.toThrow('Create failed');
    });
  });

  describe('update', () => {
    const mockUpdateData: ProjectUpdateData = {
      name: 'Updated Project',
      color_name: 'green',
      color_hex: '#00FF00',
    };

    it('should update project successfully', async () => {
      const updatedProject = { ...mockProject, ...mockUpdateData };
      mockedDatabases.updateDocument.mockResolvedValue(updatedProject);

      const result = await projectRepository.update(mockProjectId, mockUpdateData);

      expect(mockedDatabases.updateDocument).toHaveBeenCalledWith(
        mockDatabaseId,
        mockCollectionId,
        mockProjectId,
        mockUpdateData
      );
      expect(result).toEqual(updatedProject);
    });

    it('should propagate error when updateDocument fails', async () => {
      mockedDatabases.updateDocument.mockRejectedValue(new Error('Update failed'));

      await expect(projectRepository.update(mockProjectId, mockUpdateData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete project successfully', async () => {
      mockedDatabases.deleteDocument.mockResolvedValue({});

      await projectRepository.delete(mockProjectId);

      expect(mockedDatabases.deleteDocument).toHaveBeenCalledWith(mockDatabaseId, mockCollectionId, mockProjectId);
    });

    it('should propagate error when deleteDocument fails', async () => {
      mockedDatabases.deleteDocument.mockRejectedValue(new Error('Delete failed'));

      await expect(projectRepository.delete(mockProjectId)).rejects.toThrow('Delete failed');
    });
  });
});
