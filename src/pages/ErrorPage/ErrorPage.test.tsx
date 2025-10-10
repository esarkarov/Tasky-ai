import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { ErrorPage } from './ErrorPage';
import type { ReactElement, ReactNode } from 'react';

const mockUseRouteError = vi.fn();
const mockIsRouteErrorResponse = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useRouteError: () => mockUseRouteError(),
    isRouteErrorResponse: (error: unknown) => mockIsRouteErrorResponse(error),
  };
});

vi.mock('@/components/atoms/Head', () => ({
  Head: ({ title }: { title: string }) => <title data-testid="meta-title">{title}</title>,
}));

vi.mock('@/components/organisms/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/organisms/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, ...props }: { children: ReactNode; variant?: string }) => (
    <button
      data-testid="button"
      data-variant={variant}
      {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/assets', () => ({
  pageNotFound: 'page-not-found.png',
}));

vi.mock('@/constants/routes', () => ({
  ROUTES: {
    HOME: '/',
    INBOX: '/inbox',
  },
}));

const renderWithRouter = (component: ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render Head component with correct title', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | Something went wrong');
    });

    it('should render Header component', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByRole('link', { name: /Return to Home page/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Go to your Inbox/i })).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should display 404 title when route error response is detected', () => {
      const notFoundError = { status: 404, statusText: 'Not Found' };
      mockUseRouteError.mockReturnValue(notFoundError);
      mockIsRouteErrorResponse.mockReturnValue(true);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hmmm, that page doesn't exist.");
    });

    it('should display 404 description message', () => {
      const notFoundError = { status: 404, statusText: 'Not Found' };
      mockUseRouteError.mockReturnValue(notFoundError);
      mockIsRouteErrorResponse.mockReturnValue(true);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByText(/You can get back on track and manage your tasks with ease/i)).toBeInTheDocument();
    });

    it('should display 404 image alt text', () => {
      const notFoundError = { status: 404, statusText: 'Not Found' };
      mockUseRouteError.mockReturnValue(notFoundError);
      mockIsRouteErrorResponse.mockReturnValue(true);

      renderWithRouter(<ErrorPage />);

      const image = screen.getByAltText('404 page not found illustration');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'page-not-found.png');
    });

    it('should display generic error title when not a route error', () => {
      mockUseRouteError.mockReturnValue(new Error('Server error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Something went wrong.');
    });

    it('should display generic error description message', () => {
      mockUseRouteError.mockReturnValue(new Error('Server error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByText(/We're working on fixing this issue. Please try again later/i)).toBeInTheDocument();
    });

    it('should display generic error image alt text', () => {
      mockUseRouteError.mockReturnValue(new Error('Server error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const image = screen.getByAltText('Generic error illustration');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'page-not-found.png');
    });
  });

  describe('User Interactions', () => {
    it('should have working Return to Home button', async () => {
      const user = userEvent.setup();
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const homeLink = screen.getByRole('link', { name: /Return to Home page/i });
      expect(homeLink).toHaveAttribute('href', '/');

      await user.click(homeLink);
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have working View Inbox button', async () => {
      const user = userEvent.setup();
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const inboxLink = screen.getByRole('link', { name: /Go to your Inbox/i });
      expect(inboxLink).toHaveAttribute('href', '/inbox');

      await user.click(inboxLink);
      expect(inboxLink).toHaveAttribute('href', '/inbox');
    });

    it('should render both action buttons with correct variants', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const buttons = screen.getAllByTestId('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).not.toHaveAttribute('data-variant');
      expect(buttons[1]).toHaveAttribute('data-variant', 'ghost');
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labelledby on main element', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-labelledby', 'error-page-title');
    });

    it('should have aria-live on description paragraph', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const description = screen.getByText(/We're working on fixing this issue/i);
      expect(description).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-label on action buttons group', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const actionsGroup = screen.getByRole('group', { name: /Error recovery actions/i });
      expect(actionsGroup).toBeInTheDocument();
    });

    it('should have correct heading hierarchy', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('id', 'error-page-title');
      expect(heading).toBeInTheDocument();
    });

    it('should have aria-label on both action links', () => {
      mockUseRouteError.mockReturnValue(new Error('Test error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      const homeLink = screen.getByRole('link', { name: /Return to Home page/i });
      const inboxLink = screen.getByRole('link', { name: /Go to your Inbox/i });

      expect(homeLink).toHaveAttribute('aria-label', 'Return to Home page');
      expect(inboxLink).toHaveAttribute('aria-label', 'Go to your Inbox');
    });
  });

  describe('Integration', () => {
    it('should render complete error page for 404 error', () => {
      const notFoundError = { status: 404, statusText: 'Not Found' };
      mockUseRouteError.mockReturnValue(notFoundError);
      mockIsRouteErrorResponse.mockReturnValue(true);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hmmm, that page doesn't exist.");
      expect(screen.getByText(/You can get back on track/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Return to Home page/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Go to your Inbox/i })).toBeInTheDocument();
      expect(screen.getByAltText('404 page not found illustration')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render complete error page for generic error', () => {
      mockUseRouteError.mockReturnValue(new Error('Server error'));
      mockIsRouteErrorResponse.mockReturnValue(false);

      renderWithRouter(<ErrorPage />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Something went wrong.');
      expect(screen.getByText(/We're working on fixing this issue/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Return to Home page/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Go to your Inbox/i })).toBeInTheDocument();
      expect(screen.getByAltText('Generic error illustration')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });
});
