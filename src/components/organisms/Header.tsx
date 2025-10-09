import { Logo } from '@/components/atoms/Logo';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router';
import { AuthActions } from '@/components/molecules/AuthActions';

export const Header = () => {
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
          <AuthActions />
        </div>
      </div>
    </header>
  );
};
