import { AppSidebar } from '@/components/organisms/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TIMING } from '@/constants/timing';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { Outlet, useNavigation } from 'react-router';

export const AppTemplate = memo(() => {
  const { state, formData } = useNavigation();
  const isLoading = state === 'loading' && !formData;

  return (
    <SidebarProvider>
      <TooltipProvider
        delayDuration={TIMING.DELAY_DURATION}
        disableHoverableContent>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <main
            id="main-content"
            className={cn('flex-1 focus:outline-none', isLoading && 'pointer-events-none animate-pulse opacity-50')}
            tabIndex={-1}
            aria-busy={isLoading}
            aria-live="polite">
            <Outlet />
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
});

AppTemplate.displayName = 'AppTemplate';
