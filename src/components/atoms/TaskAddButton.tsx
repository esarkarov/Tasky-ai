import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

type TaskAddButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export const TaskAddButton = (props: TaskAddButtonProps) => {
  return (
    <Button
      variant="link"
      className="mb-4 w-full justify-start px-0"
      aria-label="Add task"
      {...props}>
      <CirclePlus
        aria-hidden="true"
        focusable="false"
      />
      <span>Add</span>
    </Button>
  );
};
