import { AppSidebar } from '@/components/organisms/AppSidebar';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';
import { IProjectsLoaderData } from '@/types/loader.types';
import { memo } from 'react';
import { Outlet, useLoaderData, useNavigation } from 'react-router';
import { SidebarProvider } from '@/components/ui/sidebar';

export const AppTemplate = memo(() => {
  const navigation = useNavigation();
  const { projects } = useLoaderData<IProjectsLoaderData>();
  const isLoading = navigation.state === 'loading' && !navigation.formData;

  return (
    <SidebarProvider>
      <ProjectProvider projects={projects}>
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
      </ProjectProvider>
    </SidebarProvider>
  );
});

AppTemplate.displayName = 'AppTemplate';
