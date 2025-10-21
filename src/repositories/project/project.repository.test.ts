import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectRepository } from './project.repository';
import { databases } from '@/lib/appwrite';
import { env } from '@/config/env.config';
import { projectQueries } from '@/queries/project/project.queries';
import {
  ProjectEntity,
  ProjectsListResponse,
  ProjectCreateInput,
  ProjectUpdateInput,
  ProjectListItem,
} from '@/types/projects.types';

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
const mockedProjectQueries = vi.mocked(projectQueries);

describe('projectRepository', () => {
  const MOCK_DATABASE_ID = 'test-database';
  const MOCK_COLLECTION_ID = 'test-projects';
  const MOCK_PROJECT_ID = 'project-123';
  const MOCK_USER_ID = 'user-123';
  const MOCK_QUERIES = ['query1', 'query2'];

  const createMockProject = (overrides?: Partial<ProjectEntity>): ProjectEntity => ({
    $id: MOCK_PROJECT_ID,
    userId: MOCK_USER_ID,
    name: 'Test Project',
    color_name: 'blue',
    color_hex: '#0000FF',
    tasks: [],
    $createdAt: '',
    $updatedAt: '',
    $permissions: [],
    $databaseId: '',
    $collectionId: '',
    ...overrides,
  });

  const createMockProjectListItem = (overrides?: Partial<ProjectListItem>): ProjectListItem => ({
    $id: MOCK_PROJECT_ID,
    name: 'Test Project',
    color_name: 'blue',
    color_hex: '#0000FF',
    $createdAt: '2023-01-01',
    $updatedAt: '',
    $permissions: [],
    $databaseId: '',
    $collectionId: '',
    ...overrides,
  });

  const createMockProjectsResponse = (
    items: ProjectListItem[] = [createMockProjectListItem()]
  ): ProjectsListResponse => ({
    documents: items,
    total: items.length,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    env.appwriteDatabaseId = MOCK_DATABASE_ID;
    env.appwriteProjectsCollectionId = MOCK_COLLECTION_ID;
  });

  describe('findById', () => {
    it('should return project when found', async () => {
      const mockProject = createMockProject();
      mockedDatabases.getDocument.mockResolvedValue(mockProject);

      const result = await projectRepository.findById(MOCK_PROJECT_ID);

      expect(mockedDatabases.getDocument).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_PROJECT_ID);
      expect(result).toEqual(mockProject);
    });

    it('should propagate error when document not found', async () => {
      mockedDatabases.getDocument.mockRejectedValue(new Error('Document not found'));

      await expect(projectRepository.findById(MOCK_PROJECT_ID)).rejects.toThrow('Document not found');
    });
  });

  describe('listByUserId', () => {
    const mockFilterOptions = [
      { description: 'with search query', options: { search: 'test' } },
      { description: 'with limit', options: { limit: 5 } },
      { description: 'without options', options: undefined },
    ];

    it.each(mockFilterOptions)('should return user projects $description', async ({ options }) => {
      const mockResponse = createMockProjectsResponse();
      mockedProjectQueries.userProjects.mockReturnValue(MOCK_QUERIES);
      mockedDatabases.listDocuments.mockResolvedValue(mockResponse);

      const result = await projectRepository.listByUserId(MOCK_USER_ID, options);

      expect(mockedProjectQueries.userProjects).toHaveBeenCalledWith(MOCK_USER_ID, options);
      expect(mockedDatabases.listDocuments).toHaveBeenCalledWith(MOCK_DATABASE_ID, MOCK_COLLECTION_ID, MOCK_QUERIES);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate error when query fails', async () => {
      mockedProjectQueries.userProjects.mockReturnValue([]);
      mockedDatabases.listDocuments.mockRejectedValue(new Error('Query failed'));

      await expect(projectRepository.listByUserId(MOCK_USER_ID)).rejects.toThrow('Query failed');
    });
  });

  describe('create', () => {
    const createMockCreateData = (overrides?: Partial<ProjectCreateInput>): ProjectCreateInput => ({
      name: 'New Project',
      color_name: 'red',
      color_hex: '#FF0000',
      userId: MOCK_USER_ID,
      ...overrides,
    });

    it('should create project successfully', async () => {
      const createData = createMockCreateData();
      const mockProject = createMockProject();
      mockedDatabases.createDocument.mockResolvedValue(mockProject);

      const result = await projectRepository.create(MOCK_PROJECT_ID, createData);

      expect(mockedDatabases.createDocument).toHaveBeenCalledWith(
        MOCK_DATABASE_ID,
        MOCK_COLLECTION_ID,
        MOCK_PROJECT_ID,
        createData
      );
      expect(result).toEqual(mockProject);
    });

    it('should propagate error when creation fails', async () => {
      const createData = createMockCreateData();
      mockedDatabases.createDocument.mockRejectedValue(new Error('Create failed'));

      await expect(projectRepository.create(MOCK_PROJECT_ID, createData)).rejects.toThrow('Create failed');
    });
  });

  describe('update', () => {
    const createMockUpdateData = (overrides?: Partial<ProjectUpdateInput>): ProjectUpdateInput => ({
      name: 'Updated Project',
      color_name: 'green',
      color_hex: '#00FF00',
      ...overrides,
    });

    it('should update project successfully', async () => {
      const updateData = createMockUpdateData();
      const updatedProject = createMockProject(updateData);
      mockedDatabases.updateDocument.mockResolvedValue(updatedProject);

      const result = await projectRepository.update(MOCK_PROJECT_ID, updateData);

      expect(mockedDatabases.updateDocument).toHaveBeenCalledWith(
        MOCK_DATABASE_ID,
        MOCK_COLLECTION_ID,
        MOCK_PROJECT_ID,
        updateData
      );
      expect(result).toEqual(updatedProject);
    });

    it('should propagate error when update fails', async () => {
      const updateData = createMockUpdateData();
      mockedDatabases.updateDocument.mockRejectedValue(new Error('Update failed'));

      await expect(projectRepository.update(MOCK_PROJECT_ID, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete project successfully', async () => {
      mockedDatabases.deleteDocument.mockResolvedValue({});

      await projectRepository.delete(MOCK_PROJECT_ID);

      expect(mockedDatabases.deleteDocument).toHaveBeenCalledWith(
        MOCK_DATABASE_ID,
        MOCK_COLLECTION_ID,
        MOCK_PROJECT_ID
      );
    });

    it('should propagate error when deletion fails', async () => {
      mockedDatabases.deleteDocument.mockRejectedValue(new Error('Delete failed'));

      await expect(projectRepository.delete(MOCK_PROJECT_ID)).rejects.toThrow('Delete failed');
    });
  });
});
