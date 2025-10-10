import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { TASK_SIDEBAR_LINKS } from '@/constants/app-links';
import { getBadgeCount } from '@/lib/utils';
import { TaskCounts } from '@/types/tasks.types';
import { memo } from 'react';
import { Link } from 'react-router';

interface TaskSidebarNavLinkProps {
  item: (typeof TASK_SIDEBAR_LINKS)[number];
  isActive: boolean;
  taskCounts: TaskCounts;
  onNavigationClick: () => void;
}

export const TaskSidebarNavLink = memo(({ item, isActive, taskCounts, onNavigationClick }: TaskSidebarNavLinkProps) => {
  const { href, label } = item;
  const badgeCount = getBadgeCount(href, taskCounts);
  const showBadge = Boolean(badgeCount && badgeCount > 0);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        onClick={onNavigationClick}>
        <Link
          to={href}
          aria-current={isActive ? 'page' : undefined}
          aria-label={label}>
          <item.icon aria-hidden="true" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>

      {showBadge && <SidebarMenuBadge aria-label={`${badgeCount} tasks`}>{badgeCount}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
});

TaskSidebarNavLink.displayName = 'SideNavItem';
