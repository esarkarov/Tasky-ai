import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InboxPage } from './InboxPage';
import type { TaskEntity } from '@/types/tasks.types';
import type { ProjectEntity } from '@/types/projects.types';
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
  AddTaskButton: ({ onClick }: { onClick: () => void }) => (
    <button
      data-testid="add-task-button"
      onClick={onClick}>
      Add Task
    </button>
  ),
}));

vi.mock('@/components/organisms/EmptyStateMessage', () => ({
  EmptyStateMessage: ({ variant }: { variant: string }) => (
    <div data-testid="empty-state-message">No {variant} tasks</div>
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

vi.mock('lucide-react', () => ({
  ClipboardCheck: () => <svg data-testid="clipboard-check-icon" />,
}));

const mockCreateTask = vi.fn();
vi.mock('@/hooks/use-task-operations.tsx', () => ({
  useTaskOperations: () => ({
    createTask: mockCreateTask,
  }),
}));

const mockUseLoaderData = vi.fn();
vi.mock('react-router', () => ({
  useLoaderData: () => mockUseLoaderData(),
}));

const mockProject: ProjectEntity = {
  $id: 'project-1',
  userId: 'user-1',
  name: 'Work Project',
  color_name: 'blue',
  color_hex: '#0000FF',
  tasks: null,
  $createdAt: '2024-01-01',
  $updatedAt: '2024-01-01',
  $permissions: [],
  $collectionId: 'collection-1',
  $databaseId: 'database-1',
};

const mockTasks: TaskEntity[] = [
  {
    id: '1',
    $id: 'task-1',
    projectId: null,
    content: 'Complete project proposal',
    completed: false,
    due_date: new Date('2024-12-31'),
    project: mockProject,
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
    project: mockProject,
    $createdAt: '2024-01-02',
    $updatedAt: '2024-01-02',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
];
describe('InboxPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    it('should render page title as "Inbox"', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Inbox');
    });

    it('should render Head component with correct title', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | Inbox');
    });

    it('should render TopAppBar with correct props', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<InboxPage />);

      const topAppBar = screen.getByTestId('top-app-bar');
      expect(topAppBar).toHaveTextContent('Inbox');
      expect(topAppBar).toHaveTextContent('2 tasks');
    });
  });

  describe('Tasks Rendering', () => {
    it('should render all tasks when tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-task-2')).toBeInTheDocument();
      expect(screen.getByText('Complete project proposal')).toBeInTheDocument();
      expect(screen.getByText('Review pull requests')).toBeInTheDocument();
    });

    it('should render correct number of task cards', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<InboxPage />);

      const taskCards = screen.getAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(2);
    });
  });

  describe('Conditional Rendering', () => {
    it('should show TotalCounter when tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toHaveTextContent('2 tasks');
    });

    it('should NOT show TotalCounter when no tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      expect(screen.queryByTestId('total-counter')).not.toBeInTheDocument();
    });

    it('should show AddTaskButton when form is closed', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
    });

    it('should show EmptyStateMessage when no tasks and form is closed', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: null },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state-message')).toHaveTextContent('No inbox tasks');
    });

    it('should NOT show EmptyStateMessage when tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<InboxPage />);

      expect(screen.queryByTestId('empty-state-message')).not.toBeInTheDocument();
    });

    it('should render singular label for one task', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: [mockTasks[0]] },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('1 task');
    });
  });

  describe('User Interactions', () => {
    it('should open TaskForm when AddTaskButton is clicked', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);
      const addButton = screen.getByTestId('add-task-button');
      await user.click(addButton);

      expect(screen.getByTestId('task-form')).toBeInTheDocument();
      expect(screen.getByText('Task Form (create)')).toBeInTheDocument();
    });

    it('should hide AddTaskButton when TaskForm is open', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);
      const addButton = screen.getByTestId('add-task-button');
      await user.click(addButton);

      expect(screen.queryByTestId('add-task-button')).not.toBeInTheDocument();
    });

    it('should hide EmptyStateMessage when TaskForm is open', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: null },
      });

      render(<InboxPage />);
      const addButton = screen.getByTestId('add-task-button');
      await user.click(addButton);

      expect(screen.queryByTestId('empty-state-message')).not.toBeInTheDocument();
    });

    it('should close TaskForm when cancel button is clicked', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);
      const addButton = screen.getByTestId('add-task-button');
      await user.click(addButton);

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
      expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
    });

    it('should call createTask when form is submitted', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);
      const addButton = screen.getByTestId('add-task-button');
      await user.click(addButton);

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(mockCreateTask).toHaveBeenCalledTimes(1);
    });

    it('should show AddTaskButton again after form is cancelled', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      await user.click(screen.getByTestId('add-task-button'));
      expect(screen.getByTestId('task-form')).toBeInTheDocument();

      await user.click(screen.getByTestId('cancel-button'));

      expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
      expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labelledby on Page component', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      const page = screen.getByTestId('page');
      expect(page).toHaveAttribute('aria-labelledby', 'inbox-page-title');
    });

    it('should have correct aria-label on PageList component', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      const pageList = screen.getByTestId('page-list');
      expect(pageList).toHaveAttribute('aria-label', 'Inbox tasks');
    });
  });

  describe('Component Integration', () => {
    it('should render all child components together', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('top-app-bar')).toBeInTheDocument();
      expect(screen.getByTestId('page')).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
      expect(screen.getByTestId('page-list')).toBeInTheDocument();
    });

    it('should display tasks and allow adding new task', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: [mockTasks[0]] },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
      expect(screen.getByTestId('add-task-button')).toBeInTheDocument();

      await user.click(screen.getByTestId('add-task-button'));

      expect(screen.getByTestId('task-form')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tasks array', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-message')).toBeInTheDocument();
      const taskCards = screen.queryAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(0);
    });

    it('should handle null documents', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: null },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
    });

    it('should handle tasks with projects', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<InboxPage />);

      expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-task-2')).toBeInTheDocument();
    });
  });
});
