import { TaskForm } from '@/components/organisms/TaskForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ROUTES } from '@/constants/routes';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { startOfToday } from 'date-fns';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router';

export const TaskFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { createTask } = useTaskOperations({
    onSuccess: () => setIsOpen(false),
  });
  const isToday = pathname === ROUTES.TODAY;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="p-0 border-0 !rounded-xl"
        aria-label="Create new task form">
        <TaskForm
          defaultFormData={{
            content: '',
            due_date: isToday ? startOfToday() : null,
            projectId: null,
          }}
          mode="create"
          onCancel={() => setIsOpen(false)}
          onSubmit={createTask}
        />
      </DialogContent>
    </Dialog>
  );
};
