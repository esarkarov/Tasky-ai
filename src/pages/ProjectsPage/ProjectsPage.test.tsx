import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectsPage } from './ProjectsPage';
import type { ProjectListItem } from '@/types/project.types';
import type { ReactNode } from 'react';

vi.mock('lucide-react', () => ({
  FolderKanban: () => <svg data-testid="folder-kanban-icon" />,
  Plus: () => <svg data-testid="plus-icon" />,
}));

vi.mock('@/constants/routes', () => ({
  ROUTES: {
    PROJECTS: '/app/projects',
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

const mockSearchProjects = vi.fn();
const mockFetcherForm = vi.fn(({ children, ...props }: { children: ReactNode }) => (
  <form
    data-testid="fetcher-form"
    {...props}>
    {children}
  </form>
));

vi.mock('@/hooks/use-projectOperations', () => ({
  useProjectOperations: () => ({
    fetcher: {
      data: null,
      Form: mockFetcherForm,
    },
    searchStatus: 'idle',
    searchProjects: mockSearchProjects,
  }),
}));

const mockUseLoaderData = vi.fn();
vi.mock('react-router', () => ({
  useLoaderData: () => mockUseLoaderData(),
}));

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
    <div
      data-testid="page-list"
      {...props}>
      {children}
    </div>
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

vi.mock('@/components/molecules/ProjectSearchField', () => ({
  ProjectSearchField: ({
    onSearchProjects,
    searchStatus,
  }: {
    onSearchProjects: (query: string) => void;
    searchStatus: string;
  }) => (
    <input
      data-testid="project-search-field"
      placeholder="Search projects"
      onChange={(e) => onSearchProjects(e.target.value)}
      disabled={searchStatus === 'searching'}
    />
  ),
}));

vi.mock('@/components/organisms/ProjectCard', () => ({
  ProjectCard: ({ project }: { project: ProjectListItem }) => (
    <div data-testid={`project-card-${project.$id}`}>{project.name}</div>
  ),
}));

vi.mock('@/components/organisms/ProjectFormDialog', () => ({
  ProjectFormDialog: ({ children, method }: { children: ReactNode; method: string }) => (
    <div
      data-testid="project-form-dialog"
      data-method={method}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/organisms/TopAppBar', () => ({
  TopAppBar: ({ title, taskCount }: { title: string; taskCount: number }) => (
    <header data-testid="top-app-bar">
      <h1>{title}</h1>
      <span>{taskCount} projects</span>
    </header>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <button
      data-testid="create-project-button"
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}>
      {children}
    </button>
  ),
}));

const mockProjects: ProjectListItem[] = [
  {
    $id: 'project-1',
    name: 'Work Project',
    color_name: 'blue',
    color_hex: '#0000FF',
    $createdAt: '2024-01-01',
    $updatedAt: '2024-01-01',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
  {
    $id: 'project-2',
    name: 'Personal Project',
    color_name: 'green',
    color_hex: '#00FF00',
    $createdAt: '2024-01-02',
    $updatedAt: '2024-01-02',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
];
describe('ProjectsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    it('should render page title as "My Projects"', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('page-title')).toHaveTextContent('My Projects');
    });

    it('should render Head component with correct title', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | My Projects');
    });

    it('should render TopAppBar with correct props', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      const topAppBar = screen.getByTestId('top-app-bar');
      expect(topAppBar).toHaveTextContent('My Projects');
      expect(topAppBar).toHaveTextContent('2 projects');
    });
  });

  describe('Projects Rendering', () => {
    it('should render all projects when projects exist', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('project-card-project-1')).toBeInTheDocument();
      expect(screen.getByTestId('project-card-project-2')).toBeInTheDocument();
      expect(screen.getByText('Work Project')).toBeInTheDocument();
      expect(screen.getByText('Personal Project')).toBeInTheDocument();
    });

    it('should render correct number of project cards', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      const projectCards = screen.getAllByTestId(/^project-card-/);
      expect(projectCards).toHaveLength(2);
    });

    it('should display total counter with correct count', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('2 projects');
    });
  });

  describe('Conditional Rendering', () => {
    it('should show "No project found" message when no projects exist', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      expect(screen.getByText('No project found')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('No project found');
    });

    it('should NOT show "No project found" message when projects exist', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      expect(screen.queryByText('No project found')).not.toBeInTheDocument();
    });

    it('should show total counter with singular label for one project', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 1, documents: [mockProjects[0]] },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('1 project');
    });
  });

  describe('User Interactions', () => {
    it('should render create project button', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('create-project-button')).toBeInTheDocument();
      expect(screen.getByTestId('create-project-button')).toHaveAttribute('aria-label', 'Create a new project');
    });

    it('should render ProjectFormDialog with correct method', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      const dialog = screen.getByTestId('project-form-dialog');
      expect(dialog).toHaveAttribute('data-method', 'POST');
    });

    it('should call searchProjects when search field changes', async () => {
      const user = userEvent.setup();
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);
      const searchField = screen.getByTestId('project-search-field');
      await user.type(searchField, 'Work');

      expect(mockSearchProjects).toHaveBeenCalled();
      expect(mockSearchProjects).toHaveBeenCalledWith(expect.stringContaining('W'));
    });

    it('should render search form with correct role', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      const form = screen.getByTestId('fetcher-form');
      expect(form).toHaveAttribute('role', 'search');
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labelledby on Page component', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      const page = screen.getByTestId('page');
      expect(page).toHaveAttribute('aria-labelledby', 'projects-page-title');
    });

    it('should have correct aria-label on PageList component', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      const pageList = screen.getByTestId('page-list');
      expect(pageList).toHaveAttribute('aria-label', 'Project list');
    });

    it('should have role="status" on empty state message', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveTextContent('No project found');
    });

    it('should have aria-label on create project button', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      const button = screen.getByTestId('create-project-button');
      expect(button).toHaveAttribute('aria-label', 'Create a new project');
    });
  });

  describe('Search Functionality', () => {
    it('should render search field', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('project-search-field')).toBeInTheDocument();
    });

    it('should render fetcher form for search', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('fetcher-form')).toBeInTheDocument();
      expect(screen.getByTestId('fetcher-form')).toHaveAttribute('method', 'get');
    });
  });

  describe('Component Integration', () => {
    it('should render all main components together', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('top-app-bar')).toBeInTheDocument();
      expect(screen.getByTestId('page')).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      expect(screen.getByTestId('create-project-button')).toBeInTheDocument();
      expect(screen.getByTestId('project-search-field')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toBeInTheDocument();
    });

    it('should maintain correct component hierarchy', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 2, documents: mockProjects },
      });

      render(<ProjectsPage />);

      const page = screen.getByTestId('page');
      const pageHeader = screen.getByTestId('page-header');
      const pageList = screen.getByTestId('page-list');

      expect(page).toContainElement(pageHeader);
      expect(page).toContainElement(pageList);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty projects array gracefully', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 0, documents: [] },
      });

      render(<ProjectsPage />);

      expect(screen.getByText('No project found')).toBeInTheDocument();
      expect(screen.getByTestId('total-counter')).toHaveTextContent('0 projects');
    });

    it('should render correctly with single project', () => {
      mockUseLoaderData.mockReturnValue({
        projects: { total: 1, documents: [mockProjects[0]] },
      });

      render(<ProjectsPage />);

      expect(screen.getByTestId('total-counter')).toHaveTextContent('1 project');
      expect(screen.getByTestId('project-card-project-1')).toBeInTheDocument();
    });
  });
});
