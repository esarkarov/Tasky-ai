import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { Loader } from '@/components/atoms/Loader';
import { Outlet, useNavigation } from 'react-router';
import { memo } from 'react';

export const RootTemplate = memo(() => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' && !navigation.formData;

  return (
    <div className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <Header />
      <main
        id="main-content"
        className="grow grid grid-cols-1 items-center pt-36 pb-16"
        tabIndex={-1}
        aria-busy={isLoading}
        aria-live="polite">
        <Outlet />
      </main>
      <Footer />
      <div
        className="absolute top-20 left-0 h-10 w-80 origin-top-left rotate-45 bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 right-0 h-10 w-80 origin-top-right -rotate-45 bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      {isLoading && <Loader />}
    </div>
  );
});

RootTemplate.displayName = 'RootTemplate';
