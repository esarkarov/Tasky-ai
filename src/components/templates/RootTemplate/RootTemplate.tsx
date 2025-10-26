import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { Loader } from '@/components/atoms/Loader';
import { Outlet, useNavigation } from 'react-router';
import { memo } from 'react';

export const RootTemplate = memo(() => {
  const { state, formData } = useNavigation();
  const isLoading = state === 'loading' && !formData;

  return (
    <div className="relative isolate min-h-[100dvh] flex flex-col overflow-hidden bg-background">
      <Header />
      <main
        id="main-content"
        className="grow grid grid-cols-1 items-center pt-36 pb-24 md:pt-40 md:pb-28"
        tabIndex={-1}
        aria-busy={isLoading}
        aria-live="polite">
        <Outlet />
      </main>
      <Footer />
      <div
        className="absolute top-20 left-0 h-[500px] w-[500px] origin-top-left rotate-45 bg-primary/15 blur-[140px] pointer-events-none animate-pulse"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 right-0 h-[500px] w-[500px] origin-top-right -rotate-45 bg-orange-500/15 blur-[140px] pointer-events-none animate-pulse"
        style={{ animationDelay: '1s' }}
        aria-hidden="true"
      />
      {isLoading && <Loader />}
    </div>
  );
});

RootTemplate.displayName = 'RootTemplate';
