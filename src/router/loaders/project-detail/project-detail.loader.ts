import { projectService } from '@/services/project/project.service';
import type { LoaderFunction } from 'react-router';

export const projectDetailLoader: LoaderFunction = async ({ params }) => {
  const { projectId } = params as { projectId: string };

  const project = await projectService.getProjectById(projectId);

  return { project };
};
