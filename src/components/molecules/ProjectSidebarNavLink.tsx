import { Hash } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';
import { Link, useLocation } from 'react-router';
import { ROUTES } from '@/constants/routes';

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
