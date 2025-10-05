import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SIDEBAR_LINKS } from '@/constants/links';
import { getBadgeCount } from '@/lib/utils';
import { ITaskCounts } from '@/types/task.types';
import { memo } from 'react';
import { Link } from 'react-router';

interface SideNavItemProps {
  item: (typeof SIDEBAR_LINKS)[number];
  isActive: boolean;
  taskCounts: ITaskCounts;
  onNavigationClick: () => void;
}

export const SideNavItem = memo(({ item, isActive, taskCounts, onNavigationClick }: SideNavItemProps) => {
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

SideNavItem.displayName = 'SideNavItem';
