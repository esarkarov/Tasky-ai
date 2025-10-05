import { getProjectById } from '@/services/projectService';
import { IProjectDetailLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const projectDetailLoader: LoaderFunction = async ({ params }): Promise<IProjectDetailLoaderData> => {
  const { projectId } = params as { projectId: string };

  const project = await getProjectById(projectId);

  return { project };
};
