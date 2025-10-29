import { projectService } from '@/services/project/project.service';
import { taskService } from '@/services/task/task.service';
import type { ProjectTaskLoaderData, TasksLoaderData } from '@/types/loaders.types';
import type { ProjectEntity, ProjectsListResponse } from '@/types/projects.types';
import type { TaskEntity, TasksResponse } from '@/types/tasks.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tasksInboxLoader } from './tasks-inbox.loader';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getInboxTasks: vi.fn(),
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
  $id: 'task-123',
  content: 'Inbox Task',
  due_date: null,
  completed: false,
  projectId: null,
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  $collectionId: 'tasks',
  $databaseId: 'default',
  $permissions: [],
  ...overrides,
});

const createMockTasks = (documents: TaskEntity[] = [createMockTask()]): TasksResponse => ({
  total: documents.length,
  documents,
});

const createMockProject = (overrides: Partial<ProjectEntity> = {}): ProjectEntity => ({
  $id: 'project-1',
  name: 'Inbox Project',
  userId: 'user-1',
  color_name: 'blue',
  color_hex: '#0000FF',
  tasks: [],
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  $collectionId: 'projects',
  $databaseId: 'default',
  $permissions: [],
  ...overrides,
});

const createMockProjects = (documents: ProjectEntity[] = [createMockProject()]): ProjectsListResponse => ({
  total: documents.length,
  documents,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('tasksInboxLoader', () => {
  describe('Success cases', () => {
    it('returns inbox tasks and recent projects', async () => {
      const tasks = createMockTasks([
        createMockTask({ content: 'Inbox 1' }),
        createMockTask({ id: '2', $id: 'task-456', content: 'Inbox 2', completed: true }),
      ]);
      const projects = createMockProjects();

      mockTaskService.getInboxTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksInboxLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(result.tasks).toEqual(tasks);
      expect(result.projects).toEqual(projects);
      expect(mockTaskService.getInboxTasks).toHaveBeenCalledOnce();
      expect(mockProjectService.getRecentProjects).toHaveBeenCalledOnce();
    });

    it('handles inbox tasks with due dates', async () => {
      const tasks = createMockTasks([createMockTask({ content: 'With date', due_date: new Date('2025-01-01') })]);
      const projects = createMockProjects();

      mockTaskService.getInboxTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toBeInstanceOf(Date);
    });

    it('ensures all inbox tasks have no projectId', async () => {
      const tasks = createMockTasks([
        createMockTask({ content: 'Inbox 1' }),
        createMockTask({ id: '2', $id: 'task-456', content: 'Inbox 2' }),
      ]);
      const projects = createMockProjects();

      mockTaskService.getInboxTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksInboxLoader(createLoaderArgs())) as TasksLoaderData;

      const allAreInbox = result.tasks.documents.every((task) => task.projectId === null);
      expect(allAreInbox).toBe(true);
    });
  });

  describe('Empty state', () => {
    it('returns empty tasks and projects arrays', async () => {
      const tasks = createMockTasks([]);
      const projects = createMockProjects([]);

      mockTaskService.getInboxTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksInboxLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(result.tasks.total).toBe(0);
      expect(result.projects.total).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('throws if task service fails', async () => {
      mockTaskService.getInboxTasks.mockRejectedValue(new Error('Task service error'));
      mockProjectService.getRecentProjects.mockResolvedValue(createMockProjects());

      await expect(tasksInboxLoader(createLoaderArgs())).rejects.toThrow('Task service error');
    });

    it('throws if project service fails', async () => {
      mockTaskService.getInboxTasks.mockResolvedValue(createMockTasks());
      mockProjectService.getRecentProjects.mockRejectedValue(new Error('Project service error'));

      await expect(tasksInboxLoader(createLoaderArgs())).rejects.toThrow('Project service error');
    });
  });

  describe('Data format validation', () => {
    it('returns a valid TasksLoaderData shape', async () => {
      const tasks = createMockTasks();
      const projects = createMockProjects();

      mockTaskService.getInboxTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksInboxLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result).toHaveProperty('projects');
      expect(Array.isArray(result.tasks.documents)).toBe(true);
      expect(Array.isArray(result.projects.documents)).toBe(true);
    });
  });

  describe('Loader behavior', () => {
    it('does not rely on loader args', async () => {
      const tasks = createMockTasks([]);
      const projects = createMockProjects([]);

      mockTaskService.getInboxTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksInboxLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(result.tasks.total).toBe(0);
      expect(result.projects.total).toBe(0);
    });
  });
});
