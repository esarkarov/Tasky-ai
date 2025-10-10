import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';

vi.mock('@/components/atoms/Head', () => ({
  Head: ({ title }: { title: string }) => <title data-testid="meta-title">{title}</title>,
}));

vi.mock('@/constants/routes', () => ({
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
}));

const mockSignIn = vi.fn();
vi.mock('@clerk/clerk-react', () => ({
  SignIn: (props: Record<string, unknown>) => {
    mockSignIn(props);
    return <div data-testid="clerk-signin">Sign In Component</div>;
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<LoginPage />);
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render the page title in Head component', () => {
      const title = document.head.querySelector('[data-testid="meta-title"]');
      expect(title!.textContent).toBe('Tasky AI | Log In');
    });

    it('should render the SignIn component', () => {
      expect(screen.getByTestId('clerk-signin')).toBeInTheDocument();
    });

    it('should render screen reader only heading', () => {
      const heading = screen.getByText('Log in to Tasky AI');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('sr-only');
    });
  });

  describe('Component Configuration', () => {
    it('should pass correct routing prop to SignIn', () => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.objectContaining({
          routing: 'path',
        })
      );
    });

    it('should pass correct path prop to SignIn', () => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/login',
        })
      );
    });

    it('should pass correct signUpUrl prop to SignIn', () => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.objectContaining({
          signUpUrl: '/register',
        })
      );
    });

    it('should pass appearance configuration to SignIn', () => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.objectContaining({
          appearance: expect.objectContaining({
            elements: expect.objectContaining({
              rootBox: 'mx-auto',
              card: 'shadow-lg',
            }),
          }),
        })
      );
    });

    it('should pass all required props to SignIn component', () => {
      const signInProps = mockSignIn.mock.calls[0][0];
      expect(signInProps).toHaveProperty('routing');
      expect(signInProps).toHaveProperty('path');
      expect(signInProps).toHaveProperty('signUpUrl');
      expect(signInProps).toHaveProperty('appearance');
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark with correct role', () => {
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('role', 'main');
    });

    it('should have aria-labelledby pointing to heading id', () => {
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-labelledby', 'login-page-title');
    });

    it('should have heading with correct id for aria-labelledby', () => {
      const heading = screen.getByText('Log in to Tasky AI');
      expect(heading).toHaveAttribute('id', 'login-page-title');
    });

    it('should have screen reader only class on heading', () => {
      const heading = screen.getByText('Log in to Tasky AI');
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveClass('sr-only');
    });
  });

  describe('Component Structure', () => {
    it('should render main element containing SignIn component', () => {
      const main = screen.getByRole('main');
      const signIn = screen.getByTestId('clerk-signin');
      expect(main).toContainElement(signIn);
    });

    it('should render heading inside main element', () => {
      const main = screen.getByRole('main');
      const heading = screen.getByText('Log in to Tasky AI');
      expect(main).toContainElement(heading);
    });
  });

  describe('Routes Integration', () => {
    it('should use ROUTES constants for path configuration', () => {
      const signInProps = mockSignIn.mock.calls[0][0];
      expect(signInProps.path).toBe('/login');
      expect(signInProps.signUpUrl).toBe('/register');
    });
  });
});
