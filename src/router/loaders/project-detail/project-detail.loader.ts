import { projectService } from '@/services/project/project.service';
import { ProjectDetailLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const projectDetailLoader: LoaderFunction = async ({ params }): Promise<ProjectDetailLoaderData> => {
  const { projectId } = params as { projectId: string };

  const project = await projectService.getProjectById(projectId);

  return { project };
};
