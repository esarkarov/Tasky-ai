import type { Project } from '@/types/project.types';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppTemplate } from './AppTemplate';

const mockUseNavigation = vi.fn();
const mockUseLoaderData = vi.fn();

vi.mock('@/components/organisms/AppSidebar', () => ({
  AppSidebar: () => <aside data-testid="app-sidebar">Sidebar</aside>,
}));

vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: ReactNode }) => <div data-testid="sidebar-provider">{children}</div>,
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: ReactNode }) => <div data-testid="tooltip-provider">{children}</div>,
}));

vi.mock('@/contexts/ProjectContext', () => ({
  ProjectProvider: ({ children }: { children: ReactNode }) => <div data-testid="project-provider">{children}</div>,
}));

vi.mock('@/constants/timing', () => ({
  TIMING: {
    DELAY_DURATION: 700,
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigation: () => mockUseNavigation(),
    useLoaderData: () => mockUseLoaderData(),
    Outlet: () => <div data-testid="outlet">Page Content</div>,
  };
});

const mockProjects: Project[] = [
  {
    $id: '1',
    userId: 'user-1',
    name: 'Project 1',
    color_name: 'blue',
    color_hex: '#0000FF',
    tasks: null,
    $createdAt: '2024-01-01',
    $updatedAt: '2024-01-01',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
  {
    $id: '2',
    userId: 'user-1',
    name: 'Project 2',
    color_name: 'green',
    color_hex: '#00FF00',
    tasks: null,
    $createdAt: '2024-01-01',
    $updatedAt: '2024-01-01',
    $permissions: [],
    $collectionId: 'collection-1',
    $databaseId: 'database-1',
  },
];

describe('AppTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });
    mockUseLoaderData.mockReturnValue({ projects: mockProjects });
  });

  describe('Rendering', () => {
    it('should render all main layout components', () => {
      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render with correct provider hierarchy', () => {
      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      expect(screen.getByTestId('project-provider')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument();
    });

    it('should render with correct layout structure', () => {
      const { container } = render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const layoutContainer = container.querySelector('.flex.h-screen.w-full');
      expect(layoutContainer).toBeInTheDocument();
    });

    it('should pass projects to ProjectProvider from loader data', () => {
      const customProjects: Project[] = [
        {
          $id: '3',
          userId: 'user-2',
          name: 'Custom Project',
          color_name: 'red',
          color_hex: '#FF0000',
          tasks: null,
          $createdAt: '2024-01-02',
          $updatedAt: '2024-01-02',
          $permissions: [],
          $collectionId: 'collection-1',
          $databaseId: 'database-1',
        },
      ];
      mockUseLoaderData.mockReturnValue({ projects: customProjects });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      expect(mockUseLoaderData).toHaveBeenCalled();
      expect(screen.getByTestId('project-provider')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should NOT apply loading styles when navigation state is idle', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).not.toHaveClass('pointer-events-none');
      expect(main).not.toHaveClass('opacity-50');
    });

    it('should apply loading styles when navigation state is loading without formData', () => {
      mockUseNavigation.mockReturnValue({ state: 'loading', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveClass('pointer-events-none');
      expect(main).toHaveClass('opacity-50');
    });

    it('should NOT apply loading styles when loading WITH formData', () => {
      mockUseNavigation.mockReturnValue({
        state: 'loading',
        formData: new FormData(),
      });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).not.toHaveClass('pointer-events-none');
      expect(main).not.toHaveClass('opacity-50');
    });

    it('should NOT apply loading styles when submitting', () => {
      mockUseNavigation.mockReturnValue({ state: 'submitting', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).not.toHaveClass('pointer-events-none');
      expect(main).not.toHaveClass('opacity-50');
    });

    it('should maintain base classes regardless of loading state', () => {
      mockUseNavigation.mockReturnValue({ state: 'loading', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveClass('flex-1');
      expect(main).toHaveClass('focus:outline-none');
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark with correct attributes', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
      expect(main).toHaveAttribute('tabIndex', '-1');
      expect(main).toHaveAttribute('aria-busy', 'false');
      expect(main).toHaveAttribute('aria-live', 'polite');
    });

    it('should set aria-busy to true when loading', () => {
      mockUseNavigation.mockReturnValue({ state: 'loading', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-busy', 'true');
    });

    it('should set aria-busy to false when not loading', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-busy', 'false');
    });

    it('should maintain focus management with tabIndex on main', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('tabIndex', '-1');
    });

    it('should have proper focus outline styles', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveClass('focus:outline-none');
    });
  });

  describe('Navigation States', () => {
    it('should handle all navigation states correctly', () => {
      const states: Array<'idle' | 'loading' | 'submitting'> = ['idle', 'loading', 'submitting'];

      states.forEach((state) => {
        mockUseNavigation.mockReturnValue({ state, formData: null });

        const { unmount } = render(
          <MemoryRouter>
            <AppTemplate />
          </MemoryRouter>
        );

        const main = screen.getByRole('main');
        const shouldBeLoading = state === 'loading';

        expect(main).toHaveAttribute('aria-busy', shouldBeLoading.toString());

        if (shouldBeLoading) {
          expect(main).toHaveClass('pointer-events-none', 'opacity-50');
        } else {
          expect(main).not.toHaveClass('pointer-events-none');
          expect(main).not.toHaveClass('opacity-50');
        }

        unmount();
      });
    });
  });

  describe('Loader Data Integration', () => {
    it('should handle empty projects array', () => {
      mockUseLoaderData.mockReturnValue({ projects: [] });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      expect(screen.getByTestId('project-provider')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should handle multiple projects', () => {
      const manyProjects: Project[] = Array.from({ length: 10 }, (_, i) => ({
        $id: `project-${i}`,
        userId: 'user-1',
        name: `Project ${i}`,
        color_name: 'blue',
        color_hex: '#0000FF',
        tasks: null,
        $createdAt: '2024-01-01',
        $updatedAt: '2024-01-01',
        $permissions: [],
        $collectionId: 'collection-1',
        $databaseId: 'database-1',
      }));
      mockUseLoaderData.mockReturnValue({ projects: manyProjects });

      render(
        <MemoryRouter>
          <AppTemplate />
        </MemoryRouter>
      );

      expect(mockUseLoaderData).toHaveBeenCalled();
      expect(screen.getByTestId('project-provider')).toBeInTheDocument();
    });
  });
});
