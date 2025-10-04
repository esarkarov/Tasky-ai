import { Logo } from '@/components/atoms/Logo';
import { UserChip } from '@/components/atoms/UserChip';
import { ProjectsSection } from '@/components/organisms/ProjectsSection';
import { SideNavMenu } from '@/components/organisms/SideNavMenu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
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
        <SideNavMenu
          currentPath={location.pathname}
          taskCounts={taskCounts}
          onItemClick={handleNavigationClick}
        />

        <ProjectsSection onItemClick={handleNavigationClick} />
      </SidebarContent>

      <SidebarFooter>
        <UserChip />
      </SidebarFooter>
    </Sidebar>
  );
};
