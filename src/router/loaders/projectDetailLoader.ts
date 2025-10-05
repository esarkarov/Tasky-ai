import { getProjectById, IProject } from '@/services/projectService';
import type { LoaderFunction } from 'react-router';

export interface IProjectDetailLoaderData {
  project: IProject;
}

export const projectDetailLoader: LoaderFunction = async ({ params }): Promise<IProjectDetailLoaderData> => {
  const { projectId } = params as { projectId: string };

  const project = await getProjectById(projectId);

  return { project };
};
