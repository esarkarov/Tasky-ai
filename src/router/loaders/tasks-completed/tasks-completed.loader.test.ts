import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksCompletedLoader } from './tasks-completed.loader';
import { taskService } from '@/services/task/task.service';
import { projectService } from '@/services/project/project.service';
import type { TaskEntity, TasksResponse } from '@/types/tasks.types';
import type { ProjectEntity, ProjectListItem, ProjectsListResponse } from '@/types/projects.types';
import type { ProjectTaskLoaderData, TasksLoaderData } from '@/types/loaders.types';

vi.mock('@/services/task/task.service', () => ({
  taskService: {
    getCompletedTasks: vi.fn(),
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
  content: 'Completed task',
  completed: true,
  due_date: null,
  projectId: null,
  $createdAt: '2023-01-01T00:00:00.000Z',
  $updatedAt: '2023-01-01T00:00:00.000Z',
  $collectionId: 'tasks',
  $databaseId: 'default',
  $permissions: [],
  ...overrides,
});

const createMockTasks = (
  docs: TasksResponse['documents'] = [createMockTask()],
  total = docs.length
): TasksResponse => ({
  total,
  documents: docs,
});

const createMockProject = (overrides: Partial<ProjectListItem> = {}): ProjectEntity => ({
  $id: 'project-1',
  userId: 'user-123',
  name: 'Test Project',
  color_name: 'orange',
  color_hex: '#FFA500',
  $createdAt: '2023-01-01T00:00:00.000Z',
  $updatedAt: '2023-01-01T00:00:00.000Z',
  $collectionId: 'projects',
  $databaseId: 'default',
  $permissions: [],
  tasks: [],
  ...overrides,
});

const createMockProjects = (docs: ProjectListItem[] = [createMockProject()]): ProjectsListResponse => ({
  total: docs.length,
  documents: docs,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('tasksCompletedLoader', () => {
  describe('success cases', () => {
    it('returns multiple completed tasks and recent projects', async () => {
      const tasks = createMockTasks([
        createMockTask({ $id: 'task-1', content: 'Task 1' }),
        createMockTask({ $id: 'task-2', content: 'Task 2' }),
      ]);
      const projects = createMockProjects();

      mockTaskService.getCompletedTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as ProjectTaskLoaderData;

      expect(mockTaskService.getCompletedTasks).toHaveBeenCalledOnce();
      expect(mockProjectService.getRecentProjects).toHaveBeenCalledOnce();
      expect(result.tasks).toEqual(tasks);
      expect(result.projects).toEqual(projects);
    });

    it('includes project reference in returned tasks', async () => {
      const projectRef = createMockProject({ $id: 'project-1' });
      const tasks = createMockTasks([createMockTask({ projectId: projectRef })]);
      const projects = createMockProjects();

      mockTaskService.getCompletedTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].projectId?.$id).toBe('project-1');
    });

    it('returns task with a valid due date if present', async () => {
      const tasks = createMockTasks([createMockTask({ due_date: new Date('2023-12-31') })]);
      const projects = createMockProjects();

      mockTaskService.getCompletedTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.documents[0].due_date).toBeInstanceOf(Date);
    });
  });

  describe('empty state', () => {
    it('returns an empty task list if no tasks exist', async () => {
      const tasks = createMockTasks([], 0);
      const projects = createMockProjects();

      mockTaskService.getCompletedTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result.tasks.total).toBe(0);
      expect(result.tasks.documents).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('throws if task service fails', async () => {
      mockTaskService.getCompletedTasks.mockRejectedValue(new Error('Task error'));

      await expect(tasksCompletedLoader(createLoaderArgs())).rejects.toThrow('Task error');
    });

    it('throws if project service fails', async () => {
      const tasks = createMockTasks();
      mockTaskService.getCompletedTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockRejectedValue(new Error('Project error'));

      await expect(tasksCompletedLoader(createLoaderArgs())).rejects.toThrow('Project error');
    });
  });

  describe('data structure validation', () => {
    it('returns shape conforming to TasksLoaderData', async () => {
      const tasks = createMockTasks();
      const projects = createMockProjects();

      mockTaskService.getCompletedTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      expect(result).toHaveProperty('tasks');
      expect(result.tasks).toHaveProperty('total', 1);
      expect(result.tasks.documents).toBeInstanceOf(Array);
    });

    it('ensures all tasks in the result are marked as completed', async () => {
      const tasks = createMockTasks([createMockTask({ completed: true }), createMockTask({ completed: true })]);
      const projects = createMockProjects();

      mockTaskService.getCompletedTasks.mockResolvedValue(tasks);
      mockProjectService.getRecentProjects.mockResolvedValue(projects);

      const result = (await tasksCompletedLoader(createLoaderArgs())) as TasksLoaderData;

      const allCompleted = result.tasks.documents.every((task) => task.completed);
      expect(allCompleted).toBe(true);
    });
  });
});
