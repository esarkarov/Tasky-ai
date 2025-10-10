import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectDetailPage } from './ProjectDetailPage';
import type { Project, ProjectBase } from '@/types/project.types';
import type { ReactNode } from 'react';

vi.mock('@/components/atoms/Head', () => ({
  Head: ({ title }: { title: string }) => <title data-testid="meta-title">{title}</title>,
}));

vi.mock('@/components/atoms/Page', () => ({
  Page: ({ children, ...props }: { children: ReactNode; 'aria-labelledby': string }) => (
    <div
      data-testid="page"
      {...props}>
      {children}
    </div>
  ),
  PageHeader: ({ children }: { children: ReactNode }) => <header data-testid="page-header">{children}</header>,
  PageList: ({ children, ...props }: { children: ReactNode; 'aria-label': string }) => (
    <ul
      data-testid="page-list"
      {...props}>
      {children}
    </ul>
  ),
  PageTitle: ({ children }: { children: ReactNode }) => <h1 data-testid="page-title">{children}</h1>,
}));

vi.mock('@/components/atoms/TotalCounter', () => ({
  TotalCounter: ({ total, label }: { total: number; label: string }) => (
    <div data-testid="total-counter">
      {total} {label}
      {total !== 1 ? 's' : ''}
    </div>
  ),
}));

vi.mock('@/components/atoms/AddTaskButton', () => ({
  AddTaskButton: ({ onClick, 'aria-label': ariaLabel }: { onClick: () => void; 'aria-label': string }) => (
    <button
      data-testid="add-task-button"
      onClick={onClick}
      aria-label={ariaLabel}>
      Add Task
    </button>
  ),
}));

vi.mock('@/components/organisms/EmptyStateMessage', () => ({
  EmptyStateMessage: ({ variant }: { variant: string }) => (
    <div data-testid="empty-state-message">No {variant} tasks</div>
  ),
}));

vi.mock('@/components/organisms/ProjectActionMenu', () => ({
  ProjectActionMenu: ({ children, defaultFormData }: { children: ReactNode; defaultFormData: ProjectBase }) => (
    <div
      data-testid="project-action-menu"
      aria-label={`Actions for project ${defaultFormData.name}`}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/organisms/TaskCard', () => ({
  TaskCard: ({ id, content }: { id: string; content: string }) => <li data-testid={`task-card-${id}`}>{content}</li>,
}));

vi.mock('@/components/organisms/TaskForm', () => ({
  TaskForm: ({ onCancel, onSubmit, mode }: { onCancel: () => void; onSubmit: () => void; mode: string }) => (
    <div data-testid="task-form">
      <span>Task Form ({mode})</span>
      <button
        data-testid="cancel-button"
        onClick={onCancel}>
        Cancel
      </button>
      <button
        data-testid="submit-button"
        onClick={onSubmit}>
        Submit
      </button>
    </div>
  ),
}));

vi.mock('@/components/organisms/TopAppBar', () => ({
  TopAppBar: ({ title, taskCount }: { title: string; taskCount: number }) => (
    <header data-testid="top-app-bar">
      <h1>{title}</h1>
      <span>{taskCount} tasks</span>
    </header>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
  }: {
    children: ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <button
      data-testid="more-actions-button"
      onClick={onClick}
      aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

vi.mock('lucide-react', () => ({
  ClipboardCheck: () => <svg data-testid="clipboard-check-icon" />,
  MoreHorizontal: () => <svg data-testid="more-horizontal-icon" />,
}));

const mockCreateTask = vi.fn();
vi.mock('@/hooks/use-taskOperations.tsx', () => ({
  useTaskOperations: () => ({
    createTask: mockCreateTask,
  }),
}));

const mockUseLoaderData = vi.fn();
vi.mock('react-router', () => ({
  useLoaderData: () => mockUseLoaderData(),
}));

const mockProject: Project = {
  $id: 'project-1',
  userId: 'user-1',
  name: 'Work Project',
  color_name: 'blue',
  color_hex: '#0000FF',
  tasks: [
    {
      id: '1',
      $id: 'task-1',
      projectId: null,
      content: 'Complete project proposal',
      completed: false,
      due_date: new Date('2024-12-31'),
      $createdAt: '2024-01-01',
      $updatedAt: '2024-01-01',
      $permissions: [],
      $collectionId: 'collection-1',
      $databaseId: 'database-1',
    },
    {
      id: '2',
      $id: 'task-2',
      projectId: null,
      content: 'Review pull requests',
      completed: false,
      due_date: new Date('2024-12-30'),
      $createdAt: '2024-01-02',
      $updatedAt: '2024-01-02',
      $permissions: [],
      $collectionId: 'collection-1',
      $databaseId: 'database-1',
    },
    {
      id: '3',
      $id: 'task-3',
      content: 'Completed task',
      completed: true,
      due_date: new Date('2024-12-29'),
      projectId: null,
      $createdAt: '2024-01-03',
      $updatedAt: '2024-01-03',
      $permissions: [],
      $collectionId: 'collection-1',
      $databaseId: 'database-1',
    },
  ],
  $createdAt: '2024-01-01',
  $updatedAt: '2024-01-01',
  $permissions: [],
  $collectionId: 'collection-1',
  $databaseId: 'database-1',
};
describe('ProjectDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUseLoaderData.mockReturnValue({
        project: { ...mockProject, tasks: [] },
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    it('should render page title with project name', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Work Project');
    });

    it('should render Head component with project name in title', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | Work Project');
    });

    it('should render TopAppBar with project name and task count', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      const topAppBar = screen.getByTestId('top-app-bar');
      expect(topAppBar).toHaveTextContent('Work Project');
      expect(topAppBar).toHaveTextContent('2 tasks');
    });
  });

  describe('Tasks Filtering and Sorting', () => {
    it('should display only incomplete tasks', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-task-2')).toBeInTheDocument();
      expect(screen.queryByTestId('task-card-task-3')).not.toBeInTheDocument();
    });

    it('should sort tasks by due date (earliest first)', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      const taskCards = screen.getAllByTestId(/^task-card-/);
      expect(taskCards[0]).toHaveAttribute('data-testid', 'task-card-task-2'); // 2024-12-30
      expect(taskCards[1]).toHaveAttribute('data-testid', 'task-card-task-1'); // 2024-12-31
    });

    it('should count only incomplete tasks', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('2 tasks');
    });
  });

  describe('Conditional Rendering', () => {
    it('should show TotalCounter when incomplete tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
    });

    it('should NOT show TotalCounter when no incomplete tasks', () => {
      mockUseLoaderData.mockReturnValue({
        project: {
          ...mockProject,
          tasks: [
            {
              $id: 'task-3',
              content: 'Completed task',
              completed: true,
              due_date: '2024-12-29',
              $createdAt: '2024-01-03',
              $updatedAt: '2024-01-03',
              $permissions: [],
              $collectionId: 'collection-1',
              $databaseId: 'database-1',
            },
          ],
        },
      });

      render(<ProjectDetailPage />);

      expect(screen.queryByTestId('total-counter')).not.toBeInTheDocument();
    });

    it('should show AddTaskButton when form is closed', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
    });

    it('should show EmptyStateMessage when no incomplete tasks and form is closed', () => {
      mockUseLoaderData.mockReturnValue({
        project: { ...mockProject, tasks: [] },
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state-message')).toHaveTextContent('No project tasks');
    });

    it('should NOT show EmptyStateMessage when tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      expect(screen.queryByTestId('empty-state-message')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should open TaskForm when AddTaskButton is clicked', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);
      const addButton = screen.getByTestId('add-task-button');
      await user.click(addButton);

      expect(screen.getByTestId('task-form')).toBeInTheDocument();
      expect(screen.getByText('Task Form (create)')).toBeInTheDocument();
    });

    it('should hide AddTaskButton when TaskForm is open', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);
      await user.click(screen.getByTestId('add-task-button'));

      expect(screen.queryByTestId('add-task-button')).not.toBeInTheDocument();
    });

    it('should hide EmptyStateMessage when TaskForm is open', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        project: { ...mockProject, tasks: [] },
      });

      render(<ProjectDetailPage />);
      await user.click(screen.getByTestId('add-task-button'));

      expect(screen.queryByTestId('empty-state-message')).not.toBeInTheDocument();
    });

    it('should close TaskForm when cancel button is clicked', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);
      await user.click(screen.getByTestId('add-task-button'));
      await user.click(screen.getByTestId('cancel-button'));

      expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
      expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
    });

    it('should call createTask when form is submitted', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);
      await user.click(screen.getByTestId('add-task-button'));
      await user.click(screen.getByTestId('submit-button'));

      expect(mockCreateTask).toHaveBeenCalledTimes(1);
    });

    it('should render ProjectActionMenu with more actions button', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('project-action-menu')).toBeInTheDocument();
      expect(screen.getByTestId('more-actions-button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labelledby on Page component', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      const page = screen.getByTestId('page');
      expect(page).toHaveAttribute('aria-labelledby', 'project-detail-title');
    });

    it('should have correct aria-label on PageList component', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      const pageList = screen.getByTestId('page-list');
      expect(pageList).toHaveAttribute('aria-label', 'Tasks for project Work Project');
    });

    it('should have aria-label on AddTaskButton', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      const addButton = screen.getByTestId('add-task-button');
      expect(addButton).toHaveAttribute('aria-label', 'Add new task to this project');
    });

    it('should have aria-label on more actions button', () => {
      mockUseLoaderData.mockReturnValue({
        project: mockProject,
      });

      render(<ProjectDetailPage />);

      const moreButton = screen.getByTestId('more-actions-button');
      expect(moreButton).toHaveAttribute('aria-label', 'More actions for project Work Project');
    });
  });

  describe('Edge Cases', () => {
    it('should handle project with no tasks', () => {
      mockUseLoaderData.mockReturnValue({
        project: { ...mockProject, tasks: [] },
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.queryByTestId('total-counter')).not.toBeInTheDocument();
    });

    it('should handle project with only completed tasks', () => {
      mockUseLoaderData.mockReturnValue({
        project: {
          ...mockProject,
          tasks: [
            {
              $id: 'task-3',
              content: 'Completed task',
              completed: true,
              due_date: '2024-12-29',
              $createdAt: '2024-01-03',
              $updatedAt: '2024-01-03',
              $permissions: [],
              $collectionId: 'collection-1',
              $databaseId: 'database-1',
            },
          ],
        },
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.queryByTestId('task-card-task-3')).not.toBeInTheDocument();
    });

    it('should handle project with null tasks', () => {
      mockUseLoaderData.mockReturnValue({
        project: { ...mockProject, tasks: null },
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
    });

    it('should render singular label for one task', () => {
      mockUseLoaderData.mockReturnValue({
        project: {
          ...mockProject,
          tasks: [mockProject.tasks![0]],
        },
      });

      render(<ProjectDetailPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('1 task');
    });
  });
});
