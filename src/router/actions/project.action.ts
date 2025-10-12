import { HTTP_METHODS } from '@/constants/http-methods';
import { ROUTES } from '@/constants/routes';
import { aiService } from '@/services/ai.service';
import { projectService } from '@/services/project.service';
import { taskService } from '@/services/task.service';
import { ProjectFormData } from '@/types/projects.types';
import { errorResponse, successResponse } from '@/utils/response.utils';
import type { ActionFunction } from 'react-router';
import { redirect } from 'react-router';

const handleCreateProject = async (request: Request) => {
  const data = (await request.json()) as ProjectFormData;

  if (!data.name || data.name.trim().length === 0) {
    return errorResponse('Project name is required', 400);
  }

  const project = await projectService.createProject(data);

  if (data.ai_task_gen && data.task_gen_prompt) {
    const aiTasks = await aiService.generateProjectTasks(data.task_gen_prompt);

    if (aiTasks.length > 0) {
      await taskService.createTasksForProject(project.$id, aiTasks);
    }
  }

  return redirect(ROUTES.PROJECT(project.$id));
};

const handleUpdateProject = async (request: Request) => {
  const data = (await request.json()) as ProjectFormData;

  if (!data.id) {
    return errorResponse('Project ID is required', 400);
  }

  const { id, ...updateData } = data;
  const project = await projectService.updateProject(id, updateData);

  return successResponse('Project updated successfully', { project });
};

const handleDeleteProject = async (request: Request) => {
  const data = (await request.json()) as { id: string };

  if (!data.id) {
    return errorResponse('Project ID is required', 400);
  }

  await projectService.deleteProject(data.id);

  return successResponse('Project deleted successfully');
};

export const projectAction: ActionFunction = async ({ request }) => {
  const method = request.method;

  try {
    switch (method) {
      case HTTP_METHODS.POST:
        return await handleCreateProject(request);

      case HTTP_METHODS.PUT:
        return await handleUpdateProject(request);

      case HTTP_METHODS.DELETE:
        return await handleDeleteProject(request);

      default:
        return errorResponse('Method not allowed', 405);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process request';
    return errorResponse(message, 500);
  }
};
