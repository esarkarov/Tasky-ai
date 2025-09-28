import { env } from '@/config/env';
import { databases, Query } from '@/lib/appwrite';
import { getUserId } from '@/lib/utils';
import type { LoaderFunction } from 'react-router';

const getProjects = async (query: string) => {
  try {
    return await databases.listDocuments(env.appwriteDatabaseId, 'projects', [
      Query.contains('name', query),
      Query.select(['$id', 'name', 'color_name', 'color_hex', '$createdAt']),
      Query.equal('userId', getUserId()),
      Query.orderDesc('$createdAt'),
    ]);
  } catch (err) {
    console.log(err);
    throw new Error('Error getting projects');
  }
};

const projectsLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  const projects = await getProjects(query);

  return { projects };
};

export default projectsLoader;
