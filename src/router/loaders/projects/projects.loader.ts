import { projectService } from '@/services/project/project.service';
import type { LoaderFunction } from 'react-router';

export const projectsLoader: LoaderFunction = async ({ request }) => {
  const searchQuery = new URL(request.url).searchParams.get('q') || '';

  const projects = await projectService.getUserProjects(searchQuery);

  return { projects };
};
