import { Logo } from '@/components/atoms/Logo';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router';
import { AuthActions } from '@/components/molecules/AuthActions';

export const Header = () => {
  return (
    <header
      className="fixed top-0 left-0 z-40 w-full px-4 pt-5"
      role="banner">
      <div className="container flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-background/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] hover:bg-background/80">
        <Link
          to={ROUTES.HOME}
          className="ml-5 transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Go to home page">
          <Logo />
        </Link>

        <div className="flex items-center gap-3 mr-5">
          <AuthActions />
        </div>
      </div>
    </header>
  );
};
