import { AppSidebar } from '@/components/organisms/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TIMING } from '@/constants/timing';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';
import { ProjectsLoaderData } from '@/types/loader.types';
import { memo } from 'react';
import { Outlet, useLoaderData, useNavigation } from 'react-router';

export const AppTemplate = memo(() => {
  const { state, formData } = useNavigation();
  const { projects } = useLoaderData<ProjectsLoaderData>();
  const isLoading = state === 'loading' && !formData;

  return (
    <ProjectProvider projects={projects}>
      <SidebarProvider>
        <TooltipProvider
          delayDuration={TIMING.DELAY_DURATION}
          disableHoverableContent>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <main
              id="main-content"
              className={cn('flex-1 focus:outline-none', isLoading && 'pointer-events-none opacity-50')}
              tabIndex={-1}
              aria-busy={isLoading}
              aria-live="polite">
              <Outlet />
            </main>
          </div>
        </TooltipProvider>
      </SidebarProvider>
    </ProjectProvider>
  );
});

AppTemplate.displayName = 'AppTemplate';
