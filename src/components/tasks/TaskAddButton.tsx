import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

type TaskAddButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export const TaskAddButton = (props: TaskAddButtonProps) => {
  return (
    <Button
      variant="link"
      className="w-full justify-start mb-4 px-0"
      {...props}>
      <CirclePlus /> Add
    </Button>
  );
};
