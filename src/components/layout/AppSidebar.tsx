import { SideNavMenu } from '@/components/navigation/SideNavMenu';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { Logo } from '@/components/shared/Logo';
import { UserChip } from '@/components/shared/UserChip';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants';
import { IAppLoaderData } from '@/interfaces';
import { Link, useLoaderData, useLocation } from 'react-router';

export const AppSidebar = () => {
  const location = useLocation();
  const { taskCounts } = useLoaderData() as IAppLoaderData;
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigationClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to={ROUTES.INBOX}
          className="p-2">
          <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SideNavMenu
          currentPath={location.pathname}
          taskCounts={taskCounts}
          onItemClick={handleNavigationClick}
        />

        <ProjectsSection />
      </SidebarContent>

      <SidebarFooter>
        <UserChip />
      </SidebarFooter>
    </Sidebar>
  );
};
