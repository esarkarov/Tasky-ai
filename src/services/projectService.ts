import { env } from '@/config/env';
import { databases } from '@/lib/appwrite';
import { generateID, getUserId } from '@/lib/utils';
import { Project, ProjectFormData, ProjectListItem, ProjectsListResponse } from '@/types/project.types';
import { Query } from 'appwrite';

export const getProjectById = async (projectId: string): Promise<Project> => {
  try {
    const project = await databases.getDocument<Project>(
      env.appwriteDatabaseId,
      env.appwriteProjectsCollectionId,
      projectId
    );
    const userId = getUserId();

    if (project.userId !== userId) {
      throw new Error('You do not have permission to view this project');
    }

    return project;
  } catch (error) {
    console.error('Error fetching project:', error);

    if (error instanceof Error && error.message.includes('permission')) {
      throw error;
    }

    throw new Error('Failed to load project');
  }
};

export const getProjects = async (searchQuery: string): Promise<ProjectsListResponse> => {
  try {
    const userId = getUserId();

    return await databases.listDocuments<ProjectListItem>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, [
      Query.contains('name', searchQuery),
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.select(['$id', 'name', 'color_name', 'color_hex', '$createdAt']),
    ]);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to load projects');
  }
};

export const getRecentProjects = async (limit: number = 100): Promise<ProjectsListResponse> => {
  try {
    const userId = getUserId();

    return await databases.listDocuments(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, [
      Query.select(['$id', 'name', 'color_name', 'color_hex', '$createdAt']),
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
    ]);
  } catch (error) {
    console.error('Error fetching recent projects:', error);
    throw new Error('Failed to load recent projects');
  }
};

export const createProject = async (data: ProjectFormData): Promise<Project> => {
  try {
    const project = await databases.createDocument<Project>(
      env.appwriteDatabaseId,
      env.appwriteProjectsCollectionId,
      generateID(),
      {
        name: data.name,
        color_name: data.color_name,
        color_hex: data.color_hex,
        userId: getUserId(),
      }
    );

    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
};

export const updateProject = async (projectId: string, data: Omit<ProjectFormData, 'id'>): Promise<Project> => {
  try {
    const project = await databases.updateDocument<Project>(
      env.appwriteDatabaseId,
      env.appwriteProjectsCollectionId,
      projectId,
      {
        name: data.name,
        color_name: data.color_name,
        color_hex: data.color_hex,
      }
    );

    return project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await databases.deleteDocument(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, projectId);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};
