import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { useAuth } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router';
import { UserChip } from '@/components/shared/UserChip';

export const Header = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const isLogin = location.pathname == ROUTES.LOGIN;
  const isRegister = location.pathname == ROUTES.REGISTER;

  return (
    <header className="fixed z-40 top-0 left-0 w-full p-4">
      <div className="container h-16 border backdrop-blur-3xl rounded-xl flex justify-between items-center">
        <Link to={ROUTES.HOME}>
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
                  <Link to={ROUTES.LOGIN}>Log in</Link>
                </Button>
              )}

              {!isRegister && (
                <Button
                  asChild
                  variant="default">
                  <Link to={ROUTES.REGISTER}>Sign Up</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
