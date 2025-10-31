import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RedirectIfAuthenticated } from './RedirectIfAuthenticated';
import { MemoryRouter } from 'react-router';

vi.mock('@/components/atoms/Loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Outlet: () => <div data-testid="public-content">Public Content</div>,
    useNavigate: () => mockNavigate,
  };
});

const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockUseAuth = vi.fn();
const mockUseUser = vi.fn();
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => mockUseAuth(),
  useUser: () => mockUseUser(),
}));

vi.mock('@/constants/routes', () => ({
  ROUTES: {
    TODAY: '/today',
  },
}));

describe('RedirectIfAuthenticated', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <RedirectIfAuthenticated />
      </MemoryRouter>
    );
  };
  const setupAuth = (isLoaded: boolean, isSignedIn: boolean, user: { firstName?: string } | null = null) => {
    mockUseAuth.mockReturnValue({ isLoaded, isSignedIn });
    mockUseUser.mockReturnValue({ user });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loader while authentication is being checked', () => {
      setupAuth(false, false);

      renderComponent();

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.queryByTestId('public-content')).not.toBeInTheDocument();
    });

    it('should not navigate while loading', () => {
      setupAuth(false, false);

      renderComponent();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Unauthenticated User', () => {
    it('should render public content when user is not signed in', () => {
      setupAuth(true, false);

      renderComponent();

      expect(screen.getByTestId('public-content')).toBeInTheDocument();
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('should not redirect when not authenticated', () => {
      setupAuth(true, false);

      renderComponent();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Authenticated User', () => {
    it('should redirect to today page when user is signed in', async () => {
      setupAuth(true, true, { firstName: 'John' });

      renderComponent();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/today', { replace: true });
      });
    });

    it('should render nothing while redirecting', () => {
      setupAuth(true, true, { firstName: 'John' });

      renderComponent();

      expect(screen.queryByTestId('public-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('should redirect even without user firstName', async () => {
      setupAuth(true, true, {});

      renderComponent();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/today', { replace: true });
      });
    });

    it('should redirect even when user is null', async () => {
      setupAuth(true, true, null);

      renderComponent();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/today', { replace: true });
      });
    });
  });

  describe('Authentication State', () => {
    it('should transition from loading to unauthenticated', () => {
      setupAuth(false, false);
      const { rerender } = renderComponent();

      expect(screen.getByTestId('loader')).toBeInTheDocument();

      setupAuth(true, false);
      rerender(
        <MemoryRouter>
          <RedirectIfAuthenticated />
        </MemoryRouter>
      );

      expect(screen.getByTestId('public-content')).toBeInTheDocument();
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should transition from loading to authenticated with redirect', async () => {
      setupAuth(false, false);
      const { rerender } = renderComponent();

      expect(screen.getByTestId('loader')).toBeInTheDocument();

      setupAuth(true, true, { firstName: 'John' });
      rerender(
        <MemoryRouter>
          <RedirectIfAuthenticated />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/today', { replace: true });
      });
    });
  });
});
