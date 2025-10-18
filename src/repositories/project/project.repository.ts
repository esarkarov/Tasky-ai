import { env } from '@/config/env.config';
import { databases } from '@/lib/appwrite';
import { projectQueries } from '@/queries/project/project.queries';
import {
  ProjectEntity,
  ProjectCreateInput,
  ProjectListItem,
  ProjectsListResponse,
  ProjectUpdateInput,
} from '@/types/projects.types';

export const projectRepository = {
  findById: (id: string): Promise<ProjectEntity> =>
    databases.getDocument<ProjectEntity>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id),

  listByUserId: (userId: string, options?: { search?: string; limit?: number }): Promise<ProjectsListResponse> =>
    databases.listDocuments<ProjectListItem>(
      env.appwriteDatabaseId,
      env.appwriteProjectsCollectionId,
      projectQueries.userProjects(userId, options)
    ),

  create: (id: string, data: ProjectCreateInput): Promise<ProjectEntity> =>
    databases.createDocument<ProjectEntity>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id, data),

  update: (id: string, data: ProjectUpdateInput): Promise<ProjectEntity> =>
    databases.updateDocument<ProjectEntity>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id, data),

  delete: (id: string) => databases.deleteDocument(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id),
};
