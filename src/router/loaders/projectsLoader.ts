import { getProjects } from '@/services/projectService';
import { ProjectsLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const projectsLoader: LoaderFunction = async ({ request }): Promise<ProjectsLoaderData> => {
  const searchQuery = new URL(request.url).searchParams.get('q') || '';

  const projects = await getProjects(searchQuery);

  return { projects };
};
