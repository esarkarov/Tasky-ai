import { AppBarTitle } from '@/components/atoms/AppBarTitle';
import { SidebarToggleButton } from '@/components/atoms/SidebarToggleButton';
import { TIMING } from '@/constants/timing';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TopAppBarProps {
  title: string;
  taskCount?: number;
}

export const TopAppBar = ({ title, taskCount }: TopAppBarProps) => {
  const [showTitle, setShowTitle] = useState<boolean>(false);

  useEffect(() => {
    const listener = () => setShowTitle(window.scrollY > TIMING.SCROLL_THRESHOLD);

    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, []);

  return (
    <header
      className={cn(
        'sticky z-40 bg-background top-0 h-14 grid grid-cols-[40px,minmax(0,1fr),40px] items-center px-4',
        showTitle && 'border-b'
      )}
      role="banner"
      aria-label="Application top bar">
      <SidebarToggleButton />
      <AppBarTitle
        title={title}
        showTitle={showTitle}
        taskCount={taskCount}
      />
    </header>
  );
};
