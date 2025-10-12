import { HTTP_METHODS } from '@/constants/http-methods';
import { errorResponse, successResponse } from '@/lib/utils';
import { taskService } from '@/services/task.service';
import { TaskFormData } from '@/types/tasks.types';
import { ActionFunction } from 'react-router';

const handleCreateTask = async (request: Request) => {
  const data = (await request.json()) as TaskFormData;

  if (!data.content || data.content.trim().length === 0) {
    return errorResponse('Task content is required', 400);
  }

  const task = await taskService.createTask(data);

  return successResponse('Task created successfully', { task }, 201);
};

const handleUpdateTask = async (request: Request) => {
  const data = (await request.json()) as TaskFormData;

  if (!data.id) {
    return errorResponse('Task ID is required', 400);
  }

  const { id, ...updateData } = data;
  const task = await taskService.updateTask(id, updateData);

  return successResponse('Task updated successfully', { task });
};

const handleDeleteTask = async (request: Request) => {
  const data = (await request.json()) as { id: string };

  if (!data.id) {
    return errorResponse('Task ID is required', 400);
  }

  await taskService.deleteTask(data.id);

  return successResponse('Task deleted successfully');
};

export const taskAction: ActionFunction = async ({ request }) => {
  const method = request.method;

  try {
    switch (method) {
      case HTTP_METHODS.POST:
        return await handleCreateTask(request);

      case HTTP_METHODS.PUT:
        return await handleUpdateTask(request);

      case HTTP_METHODS.DELETE:
        return await handleDeleteTask(request);

      default:
        return errorResponse('Method not allowed', 405);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process request';
    return errorResponse(message, 500);
  }
};
