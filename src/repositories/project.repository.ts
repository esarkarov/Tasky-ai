import { env } from '@/config/env.config';
import { databases } from '@/lib/appwrite';
import { projectQueries } from '@/queries/project.queries';
import {
  Project,
  ProjectCreateData,
  ProjectListItem,
  ProjectsListResponse,
  ProjectUpdateData,
} from '@/types/projects.types';

export const projectRepository = {
  findById: (id: string): Promise<Project> =>
    databases.getDocument<Project>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id),

  listByUserId: (userId: string, options?: { search?: string; limit?: number }): Promise<ProjectsListResponse> =>
    databases.listDocuments<ProjectListItem>(
      env.appwriteDatabaseId,
      env.appwriteProjectsCollectionId,
      projectQueries.userProjects(userId, options)
    ),

  create: (id: string, data: ProjectCreateData): Promise<Project> =>
    databases.createDocument<Project>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id, data),

  update: (id: string, data: ProjectUpdateData): Promise<Project> =>
    databases.updateDocument<Project>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id, data),

  delete: (id: string) => databases.deleteDocument(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id),
};
