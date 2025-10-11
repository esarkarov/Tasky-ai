import { generateID, getUserId } from '@/lib/utils';
import { projectRepository } from '@/repositories/project.repository';
import { Project, ProjectFormData, ProjectsListResponse } from '@/types/projects.types';

export const projectService = {
  getProjectById: async (projectId: string): Promise<Project> => {
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

  createProject: async (data: ProjectFormData): Promise<Project> => {
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

  updateProject: async (projectId: string, data: Omit<ProjectFormData, 'id'>): Promise<Project> => {
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
