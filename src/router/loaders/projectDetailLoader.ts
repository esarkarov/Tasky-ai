import { env } from '@/config/env';
import { databases } from '@/lib/appwrite';
import { getUserId } from '@/lib/utils';

import type { LoaderFunction } from 'react-router';

const getProject = async (projectId: string) => {
  try {
    const project = await databases.getDocument(env.appwriteDatabaseId, 'projects', projectId);

    if (project.userId !== getUserId()) {
      throw new Error('Unauthorized');
    }

    return project;
  } catch (err) {
    console.log('Error getting project: ', err);

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error('Error getting project');
  }
};

const projectDetailLoader: LoaderFunction = async ({ params }) => {
  const { projectId } = params as { projectId: string };

  const project = await getProject(projectId);

  return { project };
};

export default projectDetailLoader;
