import { cn } from '@/utils/ui.utils';

interface AppBarTitleProps {
  taskCount?: number;
  showTitle: boolean;
  title: string;
}

export const AppBarTitle = ({ taskCount, showTitle, title }: AppBarTitleProps) => {
  return (
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
  );
};
