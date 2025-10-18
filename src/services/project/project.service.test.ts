import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from './project.service';
import { projectRepository } from '@/repositories/project/project.repository';
import { getUserId } from '@/utils/auth/auth.utils';
import { generateID } from '@/utils/text/text.utils';
import { ProjectEntity, ProjectsListResponse, ProjectFormInput, ProjectListItem } from '@/types/projects.types';

vi.mock('@/repositories/project/project.repository', () => ({
  projectRepository: {
    findById: vi.fn(),
    listByUserId: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));
vi.mock('@/utils/auth/auth.utils', () => ({
  getUserId: vi.fn(),
}));
vi.mock('@/utils/text/text.utils', () => ({
  generateID: vi.fn(),
}));

const mockedProjectRepository = vi.mocked(projectRepository);
const mockedGetUserId = vi.mocked(getUserId);
const mockedGenerateID = vi.mocked(generateID);

describe('projectService', () => {
  const mockUserId = 'user-123';
  const mockProjectId = 'project-123';
  const mockProject: ProjectEntity = {
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
  const mockProjectListItem: ProjectListItem = {
    $id: mockProjectId,
    name: 'Test Project',
    color_name: 'blue',
    color_hex: '#0000FF',
    $createdAt: '2023-01-01',
    $updatedAt: '',
    $permissions: [],
    $databaseId: '',
    $collectionId: '',
  };
  const mockProjectsResponse: ProjectsListResponse = {
    documents: [mockProjectListItem],
    total: 1,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getProjectById', () => {
    it('should return project when found successfully', async () => {
      mockedProjectRepository.findById.mockResolvedValue(mockProject);

      const result = await projectService.getProjectById(mockProjectId);

      expect(mockedProjectRepository.findById).toHaveBeenCalledWith(mockProjectId);
      expect(result).toEqual(mockProject);
    });

    it('should throw error when repository fails', async () => {
      mockedProjectRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(projectService.getProjectById(mockProjectId)).rejects.toThrow('Failed to load project');
      expect(mockedProjectRepository.findById).toHaveBeenCalledWith(mockProjectId);
    });
  });

  describe('getUserProjects', () => {
    it('should return user projects with search query', async () => {
      const searchQuery = 'test';
      mockedGetUserId.mockReturnValue(mockUserId);
      mockedProjectRepository.listByUserId.mockResolvedValue(mockProjectsResponse);

      const result = await projectService.getUserProjects(searchQuery);

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedProjectRepository.listByUserId).toHaveBeenCalledWith(mockUserId, { search: searchQuery });
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should throw error when repository fails', async () => {
      const searchQuery = 'test';
      mockedGetUserId.mockReturnValue(mockUserId);
      mockedProjectRepository.listByUserId.mockRejectedValue(new Error('Database error'));

      await expect(projectService.getUserProjects(searchQuery)).rejects.toThrow('Failed to load projects');
    });
  });

  describe('getRecentProjects', () => {
    it('should return recent projects with default limit', async () => {
      mockedGetUserId.mockReturnValue(mockUserId);
      mockedProjectRepository.listByUserId.mockResolvedValue(mockProjectsResponse);

      const result = await projectService.getRecentProjects();

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedProjectRepository.listByUserId).toHaveBeenCalledWith(mockUserId, { limit: 100 });
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should return recent projects with custom limit', async () => {
      const customLimit = 5;
      mockedGetUserId.mockReturnValue(mockUserId);
      mockedProjectRepository.listByUserId.mockResolvedValue(mockProjectsResponse);

      const result = await projectService.getRecentProjects(customLimit);

      expect(mockedProjectRepository.listByUserId).toHaveBeenCalledWith(mockUserId, { limit: customLimit });
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should throw error when repository fails', async () => {
      mockedGetUserId.mockReturnValue(mockUserId);
      mockedProjectRepository.listByUserId.mockRejectedValue(new Error('Database error'));

      await expect(projectService.getRecentProjects()).rejects.toThrow('Failed to load recent projects');
    });
  });

  describe('createProject', () => {
    const mockGeneratedId = 'generated-id-123';
    const mockFormData: ProjectFormInput = {
      name: 'New Project',
      color_name: 'red',
      color_hex: '#FF0000',
      ai_task_gen: false,
      task_gen_prompt: '',
    };

    it('should create project successfully', async () => {
      mockedGetUserId.mockReturnValue(mockUserId);
      mockedGenerateID.mockReturnValue(mockGeneratedId);
      mockedProjectRepository.create.mockResolvedValue(mockProject);

      const result = await projectService.createProject(mockFormData);

      expect(mockedGetUserId).toHaveBeenCalled();
      expect(mockedGenerateID).toHaveBeenCalled();
      expect(mockedProjectRepository.create).toHaveBeenCalledWith(mockGeneratedId, {
        name: mockFormData.name,
        color_name: mockFormData.color_name,
        color_hex: mockFormData.color_hex,
        userId: mockUserId,
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw error when repository fails', async () => {
      mockedGetUserId.mockReturnValue(mockUserId);
      mockedGenerateID.mockReturnValue(mockGeneratedId);
      mockedProjectRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(projectService.createProject(mockFormData)).rejects.toThrow('Failed to create project');
    });
  });

  describe('updateProject', () => {
    const mockUpdateData: ProjectFormInput = {
      name: 'Updated Project',
      color_name: 'green',
      color_hex: '#00FF00',
      ai_task_gen: false,
      task_gen_prompt: '',
    };

    it('should update project successfully', async () => {
      const updatedProject = { ...mockProject, ...mockUpdateData };
      mockedProjectRepository.update.mockResolvedValue(updatedProject);

      const result = await projectService.updateProject(mockProjectId, mockUpdateData);

      expect(mockedProjectRepository.update).toHaveBeenCalledWith(mockProjectId, {
        name: mockUpdateData.name,
        color_name: mockUpdateData.color_name,
        color_hex: mockUpdateData.color_hex,
      });
      expect(result).toEqual(updatedProject);
    });

    it('should throw error when repository fails', async () => {
      mockedProjectRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(projectService.updateProject(mockProjectId, mockUpdateData)).rejects.toThrow(
        'Failed to update project'
      );
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      mockedProjectRepository.delete.mockResolvedValue({});

      await projectService.deleteProject(mockProjectId);

      expect(mockedProjectRepository.delete).toHaveBeenCalledWith(mockProjectId);
    });

    it('should throw error when repository fails', async () => {
      mockedProjectRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(projectService.deleteProject(mockProjectId)).rejects.toThrow('Failed to delete project');
    });
  });
});
