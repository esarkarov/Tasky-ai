import { SidebarMenuButton } from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { Hash } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface ProjectSidebarNavLinkProps {
  $id: string;
  name: string;
  color: string;
  onNavigationClick: () => void;
}

export const ProjectSidebarNavLink = ({ onNavigationClick, $id, color, name }: ProjectSidebarNavLinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === ROUTES.PROJECT($id);

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      onClick={onNavigationClick}>
      <Link
        to={ROUTES.PROJECT($id)}
        aria-label={`Open project ${name}`}
        aria-current={isActive ? 'page' : undefined}>
        <Hash
          color={color}
          aria-hidden="true"
        />
        <span>{name}</span>
      </Link>
    </SidebarMenuButton>
  );
};
