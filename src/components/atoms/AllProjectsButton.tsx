import { ROUTES } from '@/constants/routes';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';
import { SidebarMenuButton } from '@/components/ui/sidebar';

interface AllProjectsButtonProps {
  onItemClick: () => void;
}

export const AllProjectsButton = ({ onItemClick }: AllProjectsButtonProps) => {
  return (
    <SidebarMenuButton
      asChild
      className="text-muted-foreground"
      isActive={location.pathname === ROUTES.PROJECTS}
      onClick={onItemClick}>
      <Link to="/app/projects">
        <MoreHorizontal /> All projects
      </Link>
    </SidebarMenuButton>
  );
};
