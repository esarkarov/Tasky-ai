import { Keyboard } from '@/components/atoms/Keyboard/Keyboard';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const SidebarToggleButton = () => {
  return (
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
  );
};
