import { ProjectForm } from '@/components/organisms/ProjectForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useProjectOperations } from '@/hooks/use-project-operations';
import { HttpMethod } from '@/types/shared.types';
import { ProjectInput } from '@/types/projects.types';
import { ReactNode, useState } from 'react';

interface ProjectFormDialogProps {
  defaultValues?: ProjectInput;
  children: ReactNode;
  method: HttpMethod;
}

export const ProjectFormDialog = ({ defaultValues, children, method }: ProjectFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { handleSaveProject, formState } = useProjectOperations({
    onSuccess: () => setOpen(false),
    method,
  });
  const isPostMethod = method === 'POST';

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="p-0 border-0 !rounded-xl"
        aria-label={isPostMethod ? 'Create project form' : 'Edit project form'}>
        <ProjectForm
          mode={isPostMethod ? 'create' : 'update'}
          defaultValues={defaultValues}
          handleCancel={() => setOpen(false)}
          onSubmit={handleSaveProject}
          isSubmitting={formState}
        />
      </DialogContent>
    </Dialog>
  );
};
