import { getProjects } from '@/services/projectService';
import { IProjectsLoaderData } from '@/types/loader.types';
import type { LoaderFunction } from 'react-router';

export const projectsLoader: LoaderFunction = async ({ request }): Promise<IProjectsLoaderData> => {
  const searchQuery = new URL(request.url).searchParams.get('q') || '';

  const projects = await getProjects(searchQuery);

  return { projects };
};
