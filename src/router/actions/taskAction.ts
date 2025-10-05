import { HTTP_METHODS } from '@/constants/http';
import { createTask, deleteTask, ITaskFormData, ITaskUpdateData, updateTask } from '@/services/taskService';
import { ActionFunction } from 'react-router';

export const taskAction: ActionFunction = async ({ request }) => {
  const method = request.method;

  try {
    if (method === HTTP_METHODS.POST) {
      const data = (await request.json()) as ITaskFormData;
      const task = await createTask(data);

      return {
        success: true,
        task,
        message: 'Task created successfully',
      };
    }

    if (method === HTTP_METHODS.PUT) {
      const data = (await request.json()) as ITaskUpdateData;

      if (!data.id) {
        return new Response(JSON.stringify({ message: 'Task ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { id, ...updateData } = data;
      const task = await updateTask(id, updateData);

      return {
        success: true,
        task,
        message: 'Task updated successfully',
      };
    }

    if (method === HTTP_METHODS.DELETE) {
      const data = (await request.json()) as { id: string };

      if (!data.id) {
        return new Response(JSON.stringify({ message: 'Task ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await deleteTask(data.id);

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    }

    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
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
