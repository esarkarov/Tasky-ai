import { generateProjectTasks } from '@/api/googleAI';
import { env } from '@/config/env';
import { HTTP_METHODS, ROUTES } from '@/constants';
import { IAIGenTask, IProjectForm } from '@/interfaces';
import { databases } from '@/lib/appwrite';
import { generateID, getUserId } from '@/lib/utils';
import type { Models } from 'appwrite';
import type { ActionFunction } from 'react-router';
import { redirect } from 'react-router';

const createProject = async (data: IProjectForm) => {
  let aiGeneratedTasks: IAIGenTask[] = [];
  let project: Models.Document | null = null;
  const aiTaskGen = data.ai_task_gen;
  const taskGenPrompt = data.task_gen_prompt;

  try {
    project = await databases.createDocument(env.appwriteDatabaseId, 'projects', generateID(), {
      name: data.name,
      color_name: data.color_name,
      color_hex: data.color_hex,
      userId: getUserId(),
    });
  } catch (err) {
    console.log('Error creating project: ', err);
  }

  if (aiTaskGen) {
    try {
      aiGeneratedTasks = JSON.parse((await generateProjectTasks(taskGenPrompt)) || '');
    } catch (err) {
      console.log('Error generating tasks: ', err);
    }
  }

  if (aiGeneratedTasks.length) {
    const promises = aiGeneratedTasks.map((task) => {
      return databases.createDocument(env.appwriteDatabaseId, 'tasks', generateID(), {
        ...task,
        projectId: project?.$id,
        userId: getUserId(),
      });
    });

    try {
      await Promise.all(promises);
    } catch (err) {
      console.log('Error creating project tasks: ', err);
    }
  }

  return redirect(ROUTES.PROJECT(project?.$id));
};

const projectAction: ActionFunction = async ({ request }) => {
  const method = request.method;
  const data = (await request.json()) as IProjectForm;

  if (method === HTTP_METHODS.POST) {
    return await createProject(data);
  }

  throw new Error('Invalid method');
};

export default projectAction;
