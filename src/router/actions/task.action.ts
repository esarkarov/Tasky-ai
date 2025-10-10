import { HTTP_METHODS } from '@/constants/http-methods';
import { createTask, deleteTask, updateTask } from '@/services/task.services';
import { TaskFormData } from '@/types/tasks.types';
import { ActionFunction } from 'react-router';

export const taskAction: ActionFunction = async ({ request }) => {
  const method = request.method;

  try {
    if (method === HTTP_METHODS.POST) {
      const data = (await request.json()) as TaskFormData;

      if (!data.content || data.content.trim().length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Task content is required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const task = await createTask(data);

      return new Response(
        JSON.stringify({
          success: true,
          task,
          message: 'Task created successfully',
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (method === HTTP_METHODS.PUT) {
      const data = (await request.json()) as TaskFormData;

      if (!data.id) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Task ID is required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const { id, ...updateData } = data;
      const task = await updateTask(id, updateData);

      return new Response(
        JSON.stringify({
          success: true,
          task,
          message: 'Task updated successfully',
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
            message: 'Task ID is required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      await deleteTask(data.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Task deleted successfully',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Task action error:', error);

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
