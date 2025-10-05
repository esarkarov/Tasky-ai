import { Logo } from '@/components/atoms/Logo';
import { UserChip } from '@/components/atoms/UserChip';
import { SidebarProjectsSection } from '@/components/organisms/SidebarProjectsSection';
import { SidebarNavGroup } from '@/components/organisms/SidebarNavGroup';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { IAppLoaderData } from '@/types/loader.types';
import { Link, useLoaderData, useLocation } from 'react-router';

export const AppSidebar = () => {
  const location = useLocation();
  const { taskCounts } = useLoaderData<IAppLoaderData>();
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
        <SidebarNavGroup
          currentPath={location.pathname}
          taskCounts={taskCounts}
          onNavigationClick={handleNavigationClick}
        />
        <SidebarProjectsSection onNavigationClick={handleNavigationClick} />
      </SidebarContent>
      <SidebarFooter>
        <UserChip />
      </SidebarFooter>
    </Sidebar>
  );
};
