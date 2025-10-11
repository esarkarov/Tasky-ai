import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

const mockUseAuth = vi.fn();
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/components/atoms/Head', () => ({
  Head: ({ title }: { title: string }) => <title data-testid="meta-title">{title}</title>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: ReactNode }) => (
    <button
      data-testid="button"
      {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/assets', () => ({
  heroBannerLg: 'hero-banner-lg.png',
  heroBannerSm: 'hero-banner-sm.png',
}));

vi.mock('@/constants/routes', () => ({
  ROUTES: {
    TODAY: '/today',
    REGISTER: '/register',
  },
}));

const renderWithRouter = (component: ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render page title with AI-Powered highlight', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/Simplify Your Work and Life with/i)).toBeInTheDocument();
      expect(screen.getByText('AI-Powered')).toBeInTheDocument();
      // expect(screen.getByText('Task Management.')).toBeInTheDocument();
    });

    it('should render Head component with correct title', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | AI-Powered Task Management App');
    });

    it('should render description text', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      expect(
        screen.getByText(/Simplify life for both you and your team with the AI powered task manager/i)
      ).toBeInTheDocument();
    });

    it('should render hero images with correct attributes', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const mobileImage = screen.getByAltText('Illustration of Tasky AI app interface on mobile');
      const desktopImage = screen.getByAltText('Illustration of Tasky AI app interface on desktop');

      expect(mobileImage).toBeInTheDocument();
      expect(mobileImage).toHaveAttribute('src', 'hero-banner-sm.png');

      expect(desktopImage).toBeInTheDocument();
      expect(desktopImage).toHaveAttribute('src', 'hero-banner-lg.png');
    });
  });

  describe('Conditional Rendering - User Not Signed In', () => {
    it('should show "Get Started" button when user is not signed in', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const getStartedLink = screen.getByRole('link', { name: /Create your Tasky AI account/i });
      expect(getStartedLink).toBeInTheDocument();
      expect(getStartedLink).toHaveAttribute('href', '/register');
    });

    it('should NOT show "Go to Dashboard" button when user is not signed in', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      expect(screen.queryByRole('link', { name: /Go to your dashboard/i })).not.toBeInTheDocument();
    });

    it('should show "Go to Dashboard" button when user is signed in', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: true });

      renderWithRouter(<HomePage />);

      const dashboardLink = screen.getByRole('link', { name: /Go to your dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/today');
    });

    it('should NOT show "Get Started" button when user is signed in', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: true });

      renderWithRouter(<HomePage />);

      expect(screen.queryByRole('link', { name: /Create your Tasky AI account/i })).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should navigate to register page when Get Started is clicked', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const getStartedLink = screen.getByRole('link', { name: /Create your Tasky AI account/i });
      await user.click(getStartedLink);

      expect(getStartedLink).toHaveAttribute('href', '/register');
    });

    it('should navigate to dashboard when Go to Dashboard is clicked', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({ isSignedIn: true });

      renderWithRouter(<HomePage />);

      const dashboardLink = screen.getByRole('link', { name: /Go to your dashboard/i });
      await user.click(dashboardLink);

      expect(dashboardLink).toHaveAttribute('href', '/today');
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labelledby on main section', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-labelledby', 'homepage-heading');
    });

    it('should have aria-label on description paragraph', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const description = screen.getByLabelText('App description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('should have aria-label on action buttons group', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const actionsGroup = screen.getByRole('group', { name: /Primary actions/i });
      expect(actionsGroup).toBeInTheDocument();
    });

    it('should have correct heading hierarchy', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('id', 'homepage-heading');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render complete page for signed out user', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false });

      renderWithRouter(<HomePage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByLabelText('App description')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Create your Tasky AI account/i })).toBeInTheDocument();
      expect(screen.getByAltText(/Tasky AI app interface on mobile/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Tasky AI app interface on desktop/i)).toBeInTheDocument();
    });

    it('should render complete page for signed in user', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: true });

      renderWithRouter(<HomePage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByLabelText('App description')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Go to your dashboard/i })).toBeInTheDocument();
      expect(screen.getByAltText(/Tasky AI app interface on mobile/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Tasky AI app interface on desktop/i)).toBeInTheDocument();
    });
  });
});
