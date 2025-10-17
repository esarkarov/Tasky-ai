import { projectService } from '@/services/project/project.service';
import { ProjectsLoaderData } from '@/types/loaders.types';
import type { LoaderFunction } from 'react-router';

export const projectsLoader: LoaderFunction = async ({ request }): Promise<ProjectsLoaderData> => {
  const searchQuery = new URL(request.url).searchParams.get('q') || '';

  const projects = await projectService.getUserProjects(searchQuery);

  return { projects };
};
