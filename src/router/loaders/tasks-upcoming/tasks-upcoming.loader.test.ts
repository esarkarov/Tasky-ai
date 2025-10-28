import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksUpcomingLoader } from './tasks-upcoming.loader';
import { taskService } from '@/services/task/task.service';
import { projectService } from '@/services/project/project.service';

import type { TaskEntity, TasksResponse } from '@/types/tasks.types';
import type { ProjectEntity, ProjectsListResponse } from '@/types/projects.types';
import type { ProjectTaskLoaderData, TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getUpcomingTasks: vi.fn(),
  },
}));

vi.mock('@/services/project/project.service', () => ({
  projectService: {
    getRecentProjects: vi.fn(),
  },
}));

const mockTaskService = vi.mocked(taskService);
const mockProjectService = vi.mocked(projectService);

const createLoaderArgs = () => ({
  request: new Request('http://localhost'),
  params: {},
  context: {},
});

const createMockTask = (overrides: Partial<TaskEntity> = {}): TaskEntity => ({
  id: '1',
  $id: 'task-1',
  content: 'Mock Task',
  completed: false,
  due_date: new Date('2025-12-12'),
  projectId: null,
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  $collectionId: 'tasks',
  $databaseId: 'db',
  $permissions: [],
  ...overrides,
});

const createMockProject = (overrides: Partial<ProjectEntity> = {}): ProjectEntity => ({
  $id: 'project-1',
  userId: 'user-1',
  name: 'Project A',
  color_name: 'blue',
  color_hex: '#0000FF',
  tasks: [],
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  $collectionId: 'projects',
  $databaseId: 'db',
  $permissions: [],
  ...overrides,
});

const createMockTasksResponse = (docs: TaskEntity[] = [createMockTask()]): TasksResponse => ({
  total: docs.length,
  documents: docs,
});

const createMockProjectsResponse = (docs: ProjectEntity[] = [createMockProject()]): ProjectsListResponse => ({
  total: docs.length,
  documents: docs,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('tasksUpcomingLoader', () => {
  describe('Success cases', () => {
    it('returns upcoming tasks and recent projects', async () => {
      const tasks = createMockTasksResponse();
      const projects = createMockProjectsResponse();

      mockTaskService.getUpcomingTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(result.tasks).toEqual(tasks);
      expect(result.projects).toEqual(projects);
      expect(mockTaskService.getUpcomingTasks).toHaveBeenCalledOnce();
      expect(mockProjectService.getRecentProjects).toHaveBeenCalledOnce();
    });

    it('handles empty task and project responses', async () => {
      const emptyTasks = createMockTasksResponse([]);
      const emptyProjects = createMockProjectsResponse([]);

      mockTaskService.getUpcomingTasks.mockResolvedValue(emptyTasks);
      mockProjectService.getRecentProjects.mockResolvedValue(emptyProjects);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(result.tasks.total).toBe(0);
      expect(result.projects.total).toBe(0);
    });

    it('returns tasks with a valid future due date', async () => {
      const dueDate = new Date('2025-12-25');
      const tasks = createMockTasksResponse([createMockTask({ due_date: dueDate })]);
      const projects = createMockProjectsResponse();

      mockTaskService.getUpcomingTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toEqual(dueDate);
    });

    it('returns tasks with linked project references', async () => {
      const project = createMockProject();
      const tasks = createMockTasksResponse([createMockTask({ projectId: project })]);
      const projects = createMockProjectsResponse([project]);

      mockTaskService.getUpcomingTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].projectId?.$id).toBe(project.$id);
    });
  });

  describe('Failure cases', () => {
    it('throws if getUpcomingTasks fails', async () => {
      mockTaskService.getUpcomingTasks.mockRejectedValue(new Error('Task error'));
      mockProjectService.getRecentProjects.mockResolvedValue(createMockProjectsResponse());

      await expect(tasksUpcomingLoader(createLoaderArgs())).rejects.toThrow('Task error');
    });

    it('throws if getRecentProjects fails', async () => {
      mockTaskService.getUpcomingTasks.mockResolvedValue(createMockTasksResponse());
      mockProjectService.getRecentProjects.mockRejectedValue(new Error('Project error'));

      await expect(tasksUpcomingLoader(createLoaderArgs())).rejects.toThrow('Project error');
    });
  });

  describe('Structure validation', () => {
    it('returns valid TasksLoaderData shape', async () => {
      const tasks = createMockTasksResponse();
      const projects = createMockProjectsResponse();

      mockTaskService.getUpcomingTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksUpcomingLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result).toHaveProperty('projects');
      expect(result.tasks.documents).toBeInstanceOf(Array);
      expect(result.projects.documents).toBeInstanceOf(Array);
    });
  });
});
