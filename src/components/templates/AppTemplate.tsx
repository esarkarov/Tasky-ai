import { AppSidebar } from '@/components/organisms/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TIMING } from '@/constants/timing';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { IAppLoaderData } from '@/interfaces';
import { cn } from '@/lib/utils';
import { Outlet, useLoaderData, useNavigation } from 'react-router';

export const AppTemplate = () => {
  const navigation = useNavigation();
  const { projects } = useLoaderData<IAppLoaderData>();
  const isLoading = navigation.state === 'loading' && !navigation.formData;

  return (
    <ProjectProvider projects={projects}>
      <SidebarProvider>
        <TooltipProvider
          delayDuration={TIMING.DELAY_DURATION}
          disableHoverableContent>
          <AppSidebar />

          <main className={cn('flex-1', isLoading && 'opacity-50 pointer-events-none')}>
            <Outlet />
          </main>
        </TooltipProvider>
      </SidebarProvider>
    </ProjectProvider>
  );
};
