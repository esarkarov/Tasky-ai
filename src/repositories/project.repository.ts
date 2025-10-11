import { env } from '@/config/env.config';
import { databases } from '@/lib/appwrite';
import {
  ProjectCreateData,
  Project,
  ProjectListItem,
  ProjectsListResponse,
  ProjectUpdateData,
} from '@/types/projects.types';
import { Query } from 'appwrite';

export const projectRepository = {
  findById: (id: string): Promise<Project> =>
    databases.getDocument<Project>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id),

  listByUserId: (userId: string, options?: { search?: string; limit?: number }): Promise<ProjectsListResponse> => {
    const queries = [
      Query.select(['$id', 'name', 'color_name', 'color_hex', '$createdAt']),
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ];

    if (options?.search) {
      queries.push(Query.contains('name', options.search));
    }
    if (options?.limit) {
      queries.push(Query.limit(options.limit));
    }

    return databases.listDocuments<ProjectListItem>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, queries);
  },

  create: (id: string, data: ProjectCreateData): Promise<Project> =>
    databases.createDocument<Project>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id, data),

  update: (id: string, data: ProjectUpdateData): Promise<Project> =>
    databases.updateDocument<Project>(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id, data),

  delete: (id: string) => databases.deleteDocument(env.appwriteDatabaseId, env.appwriteProjectsCollectionId, id),
};
