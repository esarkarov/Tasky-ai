import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppTemplate } from './AppTemplate';

vi.mock('@/components/organisms/AppSidebar', () => ({
  AppSidebar: () => <aside data-testid="app-sidebar">Sidebar</aside>,
}));

vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: ReactNode }) => <div data-testid="sidebar-provider">{children}</div>,
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: ReactNode }) => <div data-testid="tooltip-provider">{children}</div>,
}));

vi.mock('@/constants/timing', () => ({
  TIMING: {
    DELAY_DURATION: 700,
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

const mockUseNavigation = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigation: () => mockUseNavigation(),
    Outlet: () => <div data-testid="outlet">Page Content</div>,
  };
});

describe('AppTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });
  });

  describe('Basic Rendering', () => {
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
});
