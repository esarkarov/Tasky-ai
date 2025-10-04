import { Keyboard } from '@/components/atoms/Keyboard/Keyboard';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

    listener();
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
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger aria-label="Toggle sidebar" />
        </TooltipTrigger>
        <TooltipContent
          className="flex items-center gap-2"
          role="tooltip">
          <p>Toggle sidebar</p>
          <Keyboard kbdList={['Ctrl', 'B']} />
        </TooltipContent>
      </Tooltip>

      <div
        className={cn(
          'max-w-[480px] mx-auto text-center transition-[transform,opacity]',
          showTitle ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        )}>
        <h1
          id="top-app-bar-title"
          className="font-semibold truncate text-base">
          {title}
        </h1>
        {Boolean(taskCount) && (
          <div
            className="text-xs text-muted-foreground"
            aria-live="polite">
            {taskCount} tasks
          </div>
        )}
      </div>
    </header>
  );
};
