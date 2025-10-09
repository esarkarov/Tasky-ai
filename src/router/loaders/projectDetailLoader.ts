import { getProjectById } from '@/services/projectService';
import { ProjectDetailLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const projectDetailLoader: LoaderFunction = async ({ params }): Promise<ProjectDetailLoaderData> => {
  const { projectId } = params as { projectId: string };

  const project = await getProjectById(projectId);

  return { project };
};
