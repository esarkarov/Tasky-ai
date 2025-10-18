import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpcomingPage } from './UpcomingPage';
import type { TaskEntity } from '@/types/tasks.types';
import type { ProjectEntity } from '@/types/projects.types';
import type { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

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
  TotalCounter: ({ total, label, icon: Icon }: { total: number; label: string; icon: LucideIcon }) => (
    <div data-testid="total-counter">
      <Icon />
      {total !== 1 ? `${total} ${label}s` : `${total} ${label}`}
    </div>
  ),
}));

vi.mock('@/components/organisms/EmptyStateMessage', () => ({
  EmptyStateMessage: ({ variant }: { variant: string }) => (
    <div data-testid="empty-state-message">No {variant} tasks</div>
  ),
}));

vi.mock('@/components/organisms/TaskCard', () => ({
  TaskCard: ({
    id,
    content,
    completed,
    dueDate,
    project,
  }: {
    id: string;
    content: string;
    completed: boolean;
    dueDate: Date;
    project: ProjectEntity;
  }) => (
    <li data-testid={`task-card-${id}`}>
      <div>{content}</div>
      <div>{completed ? 'Completed' : 'Incomplete'}</div>
      <div>{dueDate.toISOString()}</div>
      <div>{project?.name || 'No project'}</div>
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

const mockTasks: TaskEntity[] = [
  {
    id: '1',
    $id: 'task-1',
    content: 'Complete project proposal',
    completed: false,
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
    content: 'Review pull requests',
    completed: false,
    due_date: new Date('2024-12-30'),
    projectId: mockProject,
    $createdAt: '2024-01-02',
    $updatedAt: '2024-01-02',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
];

describe('UpcomingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the UpcomingPage component', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('page')).toBeInTheDocument();
      expect(screen.getByTestId('top-app-bar')).toBeInTheDocument();
    });

    it('should render page title as "Upcoming"', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Upcoming');
    });

    it('should render Head component with correct title', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | Upcoming');
    });

    it('should render TopAppBar with correct props', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

      const topAppBar = screen.getByTestId('top-app-bar');
      expect(topAppBar).toHaveTextContent('Upcoming');
      expect(topAppBar).toHaveTextContent('2 tasks');
    });
  });

  describe('Tasks Rendering', () => {
    it('should render all tasks when tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

      mockTasks.forEach(({ $id }) => expect(screen.getByTestId(`task-card-${$id}`)).toBeInTheDocument());
      expect(screen.getByText('Complete project proposal')).toBeInTheDocument();
      expect(screen.getByText('Review pull requests')).toBeInTheDocument();
    });

    it('should render correct number of task cards', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

      const taskCards = screen.getAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(2);
    });

    it('should pass correct props to TaskCard components', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: [mockTasks[0]] },
      });

      render(<UpcomingPage />);

      const taskCard = screen.getByTestId(`task-card-${mockTasks[0].$id}`);
      expect(taskCard).toHaveTextContent('Complete project proposal');
      expect(taskCard).toHaveTextContent('Incomplete');
      expect(taskCard).toHaveTextContent('Work Project');
    });

    it('should render single task correctly', () => {
      const singleTask = [mockTasks[0]];
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: singleTask },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId(`task-card-${singleTask[0].$id}`)).toBeInTheDocument();
      expect(screen.queryByTestId('task-card-task-2')).not.toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should show TotalCounter when tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toHaveTextContent('2 tasks');
    });

    it('should NOT show TotalCounter when no tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      expect(screen.queryByTestId('total-counter')).not.toBeInTheDocument();
    });

    it('should show EmptyStateMessage when no tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state-message')).toHaveTextContent('No upcoming tasks');
    });

    it('should NOT show EmptyStateMessage when tasks exist', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

      expect(screen.queryByTestId('empty-state-message')).not.toBeInTheDocument();
    });

    it('should handle zero total with empty documents array', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      expect(screen.queryByTestId('total-counter')).not.toBeInTheDocument();
      const taskCards = screen.queryAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(0);
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labelledby on Page component', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      const page = screen.getByTestId('page');
      expect(page).toHaveAttribute('aria-labelledby', 'upcoming-page-title');
    });

    it('should have correct aria-label on PageList component', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      const pageList = screen.getByTestId('page-list');
      expect(pageList).toHaveAttribute('aria-label', 'Upcoming tasks');
    });

    it('should have accessible page structure with header', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should call useLoaderData hook', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 0, documents: [] },
      });

      render(<UpcomingPage />);

      expect(mockUseLoaderData).toHaveBeenCalled();
    });

    it('should handle loader data with multiple tasks', () => {
      const multipleTasks: TaskEntity[] = [
        ...mockTasks,
        {
          id: 'task-3',
          $id: 'd3lxfmgg6vmek',
          content: 'Third task',
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

      render(<UpcomingPage />);

      const taskCards = screen.getAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(3);
      expect(screen.getByTestId('total-counter')).toHaveTextContent('3 tasks');
    });

    it('should handle tasks without project', () => {
      const taskWithoutProject: TaskEntity[] = [
        {
          ...mockTasks[0],
          projectId: null,
        },
      ];
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: taskWithoutProject },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId(`task-card-${taskWithoutProject[0].$id}`)).toBeInTheDocument();
      expect(screen.getByText('No project')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render all child components together', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('top-app-bar')).toBeInTheDocument();
      expect(screen.getByTestId('page')).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
      expect(screen.getByTestId('page-list')).toBeInTheDocument();
    });

    it('should maintain correct component hierarchy', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 2, documents: mockTasks },
      });

      render(<UpcomingPage />);

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

      render(<UpcomingPage />);

      expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
      const taskCards = screen.queryAllByTestId(/^task-card-/);
      expect(taskCards).toHaveLength(0);
    });

    it('should render correctly with single task', () => {
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: [mockTasks[0]] },
      });

      render(<UpcomingPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('1 task');
    });

    it('should handle completed tasks', () => {
      const completedTask: TaskEntity = {
        ...mockTasks[0],
        completed: true,
      };
      mockUseLoaderData.mockReturnValue({
        tasks: { total: 1, documents: [completedTask] },
      });

      render(<UpcomingPage />);

      const taskCard = screen.getByTestId(`task-card-${completedTask.$id}`);
      expect(taskCard).toHaveTextContent('Completed');
    });
  });
});
