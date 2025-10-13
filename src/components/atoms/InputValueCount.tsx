import { cn } from '@/utils/ui/ui.utils';

interface InputValueCountProps {
  value: string;
  maxLength: number;
  threshold: number;
}

export const InputValueCount = ({ value, maxLength, threshold }: InputValueCountProps) => {
  const isNearLimit = value.length >= threshold;

  return (
    <div
      id="input-value-count"
      className={cn('ms-auto max-w-max text-xs text-muted-foreground', isNearLimit && 'text-destructive')}
      aria-live="polite">
      {value.length}/{maxLength}
    </div>
  );
};
