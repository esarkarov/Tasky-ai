import { Logo } from '@/components/atoms/Logo';
import { UserChip } from '@/components/atoms/UserChip';
import { ProjectsSidebarSection } from '@/components/organisms/ProjectsSidebarSection';
import { TaskSidebarNavGroup } from '@/components/organisms/TaskSidebarNavGroup';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { AppLoaderData } from '@/types/loaders.types';
import { Link, useLoaderData, useLocation } from 'react-router';

export const AppSidebar = () => {
  const { pathname } = useLocation();
  const { taskCounts } = useLoaderData<AppLoaderData>();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigationClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      role="navigation"
      aria-label="Main sidebar">
      <SidebarHeader>
        <Link
          to={ROUTES.INBOX}
          className="p-2"
          aria-label="Go to inbox">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <TaskSidebarNavGroup
          currentPath={pathname}
          taskCounts={taskCounts}
          onNavigationClick={handleNavigationClick}
        />
        <ProjectsSidebarSection onNavigationClick={handleNavigationClick} />
      </SidebarContent>
      <SidebarFooter>
        <UserChip />
      </SidebarFooter>
    </Sidebar>
  );
};
