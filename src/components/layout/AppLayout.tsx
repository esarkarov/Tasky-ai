import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TIMEOUT_DELAY } from '@/constants';
import { cn } from '@/lib/utils';
import { Outlet, useNavigation } from 'react-router';

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' && !navigation.formData;

  return (
    <>
      <SidebarProvider>
        <TooltipProvider
          delayDuration={TIMEOUT_DELAY}
          disableHoverableContent>
          <AppSidebar />

          <main className={cn('flex-1', isLoading && 'opacity-50 pointer-events-none')}>
            <Outlet />
          </main>
        </TooltipProvider>
      </SidebarProvider>

      <Toaster />
    </>
  );
};

export default AppLayout;
