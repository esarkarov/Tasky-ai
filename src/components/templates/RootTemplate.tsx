import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { Loader } from '@/components/atoms/Loader';
import { Outlet, useNavigation } from 'react-router';

export const RootTemplate = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' && !navigation.formData;

  return (
    <div className="relative isolate min-h-[100dvh] flex flex-col overflow-hidden">
      <Header />

      <main className="grow grid grid-cols-1 items-center pt-36 pb-16">
        <Outlet />
      </main>

      <Footer />

      <div className="bg-primary/20 absolute top-20 left-0 w-80 h-10 rotate-45 origin-top-left blur-3xl"></div>
      <div className="bg-primary/20 absolute top-20 right-0 w-80 h-10 -rotate-45 origin-top-right blur-3xl"></div>

      {isLoading && <Loader />}
    </div>
  );
};
