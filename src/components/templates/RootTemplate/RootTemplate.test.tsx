import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RootTemplate } from './RootTemplate';
import { MemoryRouter } from 'react-router';

vi.mock('@/components/organisms/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/organisms/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/atoms/Loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
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

describe('RootTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render all main layout components', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render decorative background elements', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      const { container } = render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements).toHaveLength(2);
    });
  });

  describe('Loading State', () => {
    it('should display loader when navigation state is loading without formData', () => {
      mockUseNavigation.mockReturnValue({ state: 'loading', formData: null });

      render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should NOT display loader when navigation state is idle', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('should NOT display loader when navigation state is loading WITH formData', () => {
      mockUseNavigation.mockReturnValue({
        state: 'loading',
        formData: new FormData(),
      });

      render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('should NOT display loader when navigation state is submitting', () => {
      mockUseNavigation.mockReturnValue({ state: 'submitting', formData: null });

      render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark with correct attributes', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <RootTemplate />
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
          <RootTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-busy', 'true');
    });

    it('should set aria-busy to false when not loading', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-busy', 'false');
    });

    it('should hide decorative elements from screen readers', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      const { container } = render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      decorativeElements.forEach((element) => {
        expect(element).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should maintain focus management with tabIndex on main', () => {
      mockUseNavigation.mockReturnValue({ state: 'idle', formData: null });

      render(
        <MemoryRouter>
          <RootTemplate />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Navigation States', () => {
    it('should handle all navigation states correctly', () => {
      const states: Array<'idle' | 'loading' | 'submitting'> = ['idle', 'loading', 'submitting'];

      states.forEach((state) => {
        mockUseNavigation.mockReturnValue({ state, formData: null });

        const { unmount } = render(
          <MemoryRouter>
            <RootTemplate />
          </MemoryRouter>
        );

        const main = screen.getByRole('main');
        const shouldBeLoading = state === 'loading';
        expect(main).toHaveAttribute('aria-busy', shouldBeLoading.toString());

        if (shouldBeLoading) {
          expect(screen.getByTestId('loader')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
        }

        unmount();
      });
    });
  });
});
