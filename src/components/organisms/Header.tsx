import { Logo } from '@/components/atoms/Logo';
import { UserChip } from '@/components/atoms/UserChip';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router';

export const Header = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const isLogin = location.pathname == ROUTES.LOGIN;
  const isRegister = location.pathname == ROUTES.REGISTER;

  return (
    <header
      className="fixed top-0 left-0 z-40 w-full p-4"
      role="banner">
      <div className="container flex h-16 items-center justify-between rounded-xl border backdrop-blur-3xl">
        <Link
          to={ROUTES.HOME}
          aria-label="Go to home page">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <UserChip />
          ) : (
            <>
              {!isLogin && (
                <Button
                  asChild
                  variant="secondary">
                  <Link
                    to={ROUTES.LOGIN}
                    aria-label="Log in to your account">
                    Log in
                  </Link>
                </Button>
              )}

              {!isRegister && (
                <Button
                  asChild
                  variant="default">
                  <Link
                    to={ROUTES.REGISTER}
                    aria-label="Create a new account">
                    Sign Up
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
