import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompletedPage } from './CompletedPage';
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

vi.mock('@/components/organisms/EmptyStateMessage', () => ({
  EmptyStateMessage: ({ variant }: { variant: string }) => (
    <div data-testid="empty-state-message">No {variant} tasks</div>
  ),
}));

vi.mock('@/components/organisms/TaskCard', () => ({
  TaskCard: ({ id, content, completed }: { id: string; content: string; completed: boolean }) => (
    <li data-testid={`task-card-${id}`}>
      <div>{content}</div>
      <div>{completed ? 'Completed' : 'Incomplete'}</div>
    </li>
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

const mockCompletedTasks: TaskEntity[] = [
  {
    id: '1',
    $id: 'task-1',
    content: 'Completed project proposal',
    completed: true,
    due_date: new Date('2024-12-31'),
    projectId: mockProject,
    $createdAt: '2024-01-01',
    $updatedAt: '2024-01-01',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
  {
    id: '2',
    $id: 'task-2',
    content: 'Reviewed pull requests',
    completed: true,
    due_date: new Date('2024-12-30'),
    projectId: mockProject,
    $createdAt: '2024-01-02',
    $updatedAt: '2024-01-02',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
];

describe('CompletedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    it('should render page title as "Completed"', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Completed');
    });

    it('should render Head component with correct title', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | Completed');
    });

    it('should render TopAppBar with correct props', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      const topAppBar = screen.getByTestId('top-app-bar');
      expect(topAppBar).toHaveTextContent('Completed');
      expect(topAppBar).toHaveTextContent('2 tasks');
    });
  });

  describe('Tasks Rendering', () => {
    it('should render all completed tasks', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-card-task-2')).toBeInTheDocument();
      expect(screen.getByText('Completed project proposal')).toBeInTheDocument();
      expect(screen.getByText('Reviewed pull requests')).toBeInTheDocument();
    });

    it('should render correct number of task cards', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      const taskCards = screen.getAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(2);
    });

    it('should display tasks as completed', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      const taskCard = screen.getByTestId('task-card-task-1');
      expect(taskCard).toHaveTextContent('Completed');
    });

    it('should render single completed task correctly', () => {
      const singleTask = [mockCompletedTasks[0]];
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: singleTask },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
      expect(screen.queryByTestId('task-card-task-2')).not.toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should show TotalCounter when completed tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toHaveTextContent('2 tasks');
    });

    it('should NOT show TotalCounter when no completed tasks', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      expect(screen.queryByTestId('total-counter')).not.toBeInTheDocument();
    });

    it('should show EmptyStateMessage when no completed tasks', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state-message')).toHaveTextContent('No completed tasks');
    });

    it('should NOT show EmptyStateMessage when completed tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      expect(screen.queryByTestId('empty-state-message')).not.toBeInTheDocument();
    });

    it('should handle zero total with empty documents array', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.queryByTestId('total-counter')).not.toBeInTheDocument();
      const taskCards = screen.queryAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(0);
    });

    it('should render singular label for one task', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: [mockCompletedTasks[0]] },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('1 task');
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labelledby on Page component', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      const page = screen.getByTestId('page');
      expect(page).toHaveAttribute('aria-labelledby', 'completed-page-title');
    });

    it('should have correct aria-label on PageList component', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      const pageList = screen.getByTestId('page-list');
      expect(pageList).toHaveAttribute('aria-label', 'Completed tasks');
    });

    it('should have accessible page structure with header', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should call useLoaderData hook', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      expect(mockUseLoaderData).toHaveBeenCalled();
    });

    it('should handle loader data with multiple completed tasks', () => {
      const multipleTasks: TaskEntity[] = [
        ...mockCompletedTasks,
        {
          id: '3',
          $id: 'task-3',
          content: 'Third completed task',
          completed: true,
          due_date: new Date('2024-12-29'),
          projectId: mockProject,
          $createdAt: '2024-01-03',
          $updatedAt: '2024-01-03',
          $permissions: [],
          $collectionId: 'collection-1',
          $databaseId: 'database-1',
        },
      ];
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 3, documents: multipleTasks },
      });

      render(<CompletedPage />);

      const taskCards = screen.getAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(3);
      expect(screen.getByTestId('total-counter')).toHaveTextContent('3 tasks');
    });

    it('should handle tasks without project', () => {
      const taskWithoutProject: TaskEntity[] = [
        {
          ...mockCompletedTasks[0],
          projectId: null,
        },
      ];
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: taskWithoutProject },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('task-card-task-1')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render all child components together', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('top-app-bar')).toBeInTheDocument();
      expect(screen.getByTestId('page')).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
      expect(screen.getByTestId('page-list')).toBeInTheDocument();
    });

    it('should maintain correct component hierarchy', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockCompletedTasks },
      });

      render(<CompletedPage />);

      const page = screen.getByTestId('page');
      const pageHeader = screen.getByTestId('page-header');
      const pageList = screen.getByTestId('page-list');

      expect(page).toContainElement(pageHeader);
      expect(page).toContainElement(pageList);
      expect(pageHeader).toContainElement(screen.getByTestId('page-title'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tasks array gracefully', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<CompletedPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      const taskCards = screen.queryAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(0);
    });
  });
});
