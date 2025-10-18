import { projectRepository } from '@/repositories/project/project.repository';
import { ProjectEntity, ProjectFormInput, ProjectsListResponse } from '@/types/projects.types';
import { getUserId } from '@/utils/auth/auth.utils';
import { generateID } from '@/utils/text/text.utils';

export const projectService = {
  getProjectById: async (projectId: string): Promise<ProjectEntity> => {
    try {
      const doc = await projectRepository.findById(projectId);

      return doc;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to load project');
    }
  },

  getUserProjects: async (searchQuery: string): Promise<ProjectsListResponse> => {
    try {
      const userId = getUserId();

      const docs = await projectRepository.listByUserId(userId, { search: searchQuery });

      return docs;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to load projects');
    }
  },

  getRecentProjects: async (limit: number = 100): Promise<ProjectsListResponse> => {
    try {
      const userId = getUserId();

      const docs = await projectRepository.listByUserId(userId, { limit });

      return docs;
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      throw new Error('Failed to load recent projects');
    }
  },

  createProject: async (data: ProjectFormInput): Promise<ProjectEntity> => {
    try {
      const payload = {
        name: data.name,
        color_name: data.color_name,
        color_hex: data.color_hex,
        userId: getUserId(),
      };

      const doc = await projectRepository.create(generateID(), payload);

      return doc;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  },

  updateProject: async (projectId: string, data: Omit<ProjectFormInput, 'id'>): Promise<ProjectEntity> => {
    try {
      const payload = {
        name: data.name,
        color_name: data.color_name,
        color_hex: data.color_hex,
      };

      const doc = await projectRepository.update(projectId, payload);

      return doc;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  },

  deleteProject: async (projectId: string): Promise<void> => {
    try {
      await projectRepository.delete(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  },
};
