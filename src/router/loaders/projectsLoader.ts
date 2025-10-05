import { getProjects, IProjectsListResponse } from '@/services/projectService';
import type { LoaderFunction } from 'react-router';

export interface IProjectsLoaderData {
  projects: IProjectsListResponse;
}

export const projectsLoader: LoaderFunction = async ({ request }): Promise<IProjectsLoaderData> => {
  const searchQuery = new URL(request.url).searchParams.get('q') || '';

  const projects = await getProjects(searchQuery);

  return { projects };
};
