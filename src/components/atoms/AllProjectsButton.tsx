import { ROUTES } from '@/constants/routes';
import { MoreHorizontal } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { SidebarMenuButton } from '@/components/ui/sidebar';

interface AllProjectsButtonProps {
  onNavigationClick: () => void;
}

export const AllProjectsButton = ({ onNavigationClick }: AllProjectsButtonProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === ROUTES.PROJECTS;

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <Link
        to={ROUTES.PROJECTS}
        aria-label="View all projects"
        aria-current={isActive ? 'page' : undefined}
        title="All projects"
        onClick={onNavigationClick}>
        <div className="inline-flex items-center gap-2">
          <MoreHorizontal
            aria-hidden="true"
            focusable="false"
          />
          <span className="truncate">All projects</span>
        </div>
      </Link>
    </SidebarMenuButton>
  );
};
