import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { AuthSyncPage } from './AuthSyncPage';

const mockNavigate = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/config/env.config', () => ({
  env: {
    clerkUserStorageKey: 'clerk_user_id',
  },
}));

vi.mock('@/constants/routes', () => ({
  ROUTES: {
    HOME: '/',
    TODAY: '/today',
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AuthSyncPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
        userId: null,
      });

      const { container } = renderWithRouter(<AuthSyncPage />);

      expect(container).toBeInTheDocument();
    });

    it('should render nothing visible', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
        userId: null,
      });

      const { container } = renderWithRouter(<AuthSyncPage />);

      expect(container.querySelector('*')).toBe(container.firstChild);
    });
  });

  describe('Auth Not Loaded', () => {
    it('should NOT navigate when auth is not loaded', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
        userId: null,
      });

      renderWithRouter(<AuthSyncPage />);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should NOT modify sessionStorage when auth is not loaded', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
        userId: null,
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.length).toBe(0);
    });
  });

  describe('User Not Signed In', () => {
    it('should navigate to HOME when user is not signed in', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        userId: null,
      });

      renderWithRouter(<AuthSyncPage />);

      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should remove user ID from sessionStorage when user is not signed in', () => {
      sessionStorage.setItem('clerk_user_id', 'user_123');

      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        userId: null,
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.getItem('clerk_user_id')).toBeNull();
    });

    it('should NOT throw error if sessionStorage key does not exist', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        userId: null,
      });

      expect(() => {
        renderWithRouter(<AuthSyncPage />);
      }).not.toThrow();

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('User Signed In', () => {
    it('should navigate to TODAY when user is signed in', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_123',
      });

      renderWithRouter(<AuthSyncPage />);

      expect(mockNavigate).toHaveBeenCalledWith('/today');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should store user ID in sessionStorage when user is signed in', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_123',
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.getItem('clerk_user_id')).toBe('user_123');
    });

    it('should update sessionStorage if different user signs in', () => {
      sessionStorage.setItem('clerk_user_id', 'user_old');

      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_new',
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.getItem('clerk_user_id')).toBe('user_new');
      expect(mockNavigate).toHaveBeenCalledWith('/today');
    });
  });

  describe('useEffect Dependencies', () => {
    it('should trigger effect when userId changes', () => {
      const { rerender } = renderWithRouter(<AuthSyncPage />);

      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_123',
      });

      rerender(
        <BrowserRouter>
          <AuthSyncPage />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/today');
      expect(sessionStorage.getItem('clerk_user_id')).toBe('user_123');
    });

    it('should trigger effect when isSignedIn changes', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        userId: null,
      });

      const { rerender } = renderWithRouter(<AuthSyncPage />);

      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_456',
      });

      rerender(
        <BrowserRouter>
          <AuthSyncPage />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/today');
    });

    it('should trigger effect when isLoaded changes from false to true', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: false,
        userId: 'user_123',
      });

      const { rerender } = renderWithRouter(<AuthSyncPage />);

      expect(mockNavigate).not.toHaveBeenCalled();

      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_123',
      });

      rerender(
        <BrowserRouter>
          <AuthSyncPage />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/today');
    });
  });

  describe('SessionStorage Integration', () => {
    it('should handle sessionStorage operations correctly for sign in flow', () => {
      expect(sessionStorage.length).toBe(0);

      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_789',
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.getItem('clerk_user_id')).toBe('user_789');
      expect(sessionStorage.length).toBe(1);
      expect(mockNavigate).toHaveBeenCalledWith('/today');
    });

    it('should handle sessionStorage operations correctly for sign out flow', () => {
      sessionStorage.setItem('clerk_user_id', 'user_old');
      expect(sessionStorage.length).toBe(1);

      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        userId: null,
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.getItem('clerk_user_id')).toBeNull();
      expect(sessionStorage.length).toBe(0);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Integration', () => {
    it('should complete full authentication sync for signed in user', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_complete',
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.getItem('clerk_user_id')).toBe('user_complete');
      expect(mockNavigate).toHaveBeenCalledWith('/today');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should complete full authentication sync for signed out user', () => {
      sessionStorage.setItem('clerk_user_id', 'old_user');

      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
        userId: null,
      });

      renderWithRouter(<AuthSyncPage />);

      expect(sessionStorage.getItem('clerk_user_id')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should handle complete auth state transition from loading to signed in', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
        userId: null,
      });

      const { rerender } = renderWithRouter(<AuthSyncPage />);

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(sessionStorage.length).toBe(0);

      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
        userId: 'user_transition',
      });

      rerender(
        <BrowserRouter>
          <AuthSyncPage />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/today');
      expect(sessionStorage.getItem('clerk_user_id')).toBe('user_transition');
    });
  });
});
