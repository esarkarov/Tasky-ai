import { UserChip } from '@/components/atoms/UserChip';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router';

export const AuthActions = () => {
  const { isSignedIn } = useAuth();
  const { pathname } = useLocation();
  const isLogin = pathname === ROUTES.LOGIN;
  const isRegister = pathname === ROUTES.REGISTER;

  if (isSignedIn) return <UserChip />;

  return (
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
  );
};
