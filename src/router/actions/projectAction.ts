import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { createProjectTasks } from '@/services/aiService';
import {
  createProject,
  deleteProject,
  IProjectFormData,
  IProjectUpdateData,
  updateProject,
} from '@/services/projectService';
import { createTasksForProject } from '@/services/taskService';
import type { ActionFunction } from 'react-router';
import { redirect } from 'react-router';

export const projectAction: ActionFunction = async ({ request }) => {
  const method = request.method;

  try {
    if (method === HTTP_METHODS.POST) {
      const data = (await request.json()) as IProjectFormData;

      if (!data.name || data.name.trim().length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Project name is required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const project = await createProject(data);

      if (data.ai_task_gen && data.task_gen_prompt) {
        const aiTasks = await createProjectTasks(data.task_gen_prompt);

        if (aiTasks.length > 0) {
          await createTasksForProject(project.$id, aiTasks);
        }
      }

      return redirect(ROUTES.PROJECT(project.$id));
    }

    if (method === HTTP_METHODS.PUT) {
      const data = (await request.json()) as IProjectUpdateData;

      if (!data.id) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Project ID is required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const { id, ...updateData } = data;
      const project = await updateProject(id, updateData);

      return new Response(
        JSON.stringify({
          success: true,
          project,
          message: 'Project updated successfully',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (method === HTTP_METHODS.DELETE) {
      const data = (await request.json()) as { id: string };

      if (!data.id) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Project ID is required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      await deleteProject(data.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Project deleted successfully',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Method not allowed',
      }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Project action error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
