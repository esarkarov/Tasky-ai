import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskAddButton } from '@/components/atoms/TaskAddButton';
import { TaskCardSkeleton } from '@/components/atoms/TaskCardSkeleton';
import { TaskEmptyState } from '@/components/atoms/TaskEmptyState';
import { ProjectActionMenu } from '@/components/organisms/ProjectActionMenu';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { Button } from '@/components/ui/button';
import { HTTP_METHODS, ROUTES } from '@/constants';
import { ITaskForm } from '@/interfaces';
import type { Models } from 'appwrite';
import { MoreHorizontal } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

const ProjectDetailPage = () => {
  const fetcher = useFetcher();
  const [isFormShow, setIsFormShow] = useState<boolean>(false);
  const { project } = useLoaderData<{ project: Models.Document }>();

  const projectTasks = useMemo(() => {
    const incompleteTasks = project.tasks.filter((task: Models.Document) => !task.completed) as Models.Document[];

    const sortedTasks = incompleteTasks.sort((taskA, taskB) => {
      const dateA = new Date(taskA.due_date);
      const dateB = new Date(taskB.due_date);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedTasks;
  }, [project.tasks]);

  const handleSubmitCreate = useCallback(
    (formData: ITaskForm) => {
      fetcher.submit(JSON.stringify(formData), {
        action: ROUTES.APP,
        method: HTTP_METHODS.POST,
        encType: 'application/json',
      });
    },
    [fetcher]
  );

  return (
    <>
      <Head title={'Tasky AI | ' + project.name} />

      <TopAppBar title={project.name} />

      <Page>
        <PageHeader>
          <div className="flex items-center gap-2">
            <PageTitle>{project.name}</PageTitle>

            <ProjectActionMenu
              defaultFormData={{
                id: project.$id,
                name: project.name,
                color_name: project.color_name,
                color_hex: project.color_hex,
              }}>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 shrink-0"
                aria-label="More actions">
                <MoreHorizontal />
              </Button>
            </ProjectActionMenu>
          </div>
        </PageHeader>

        <PageList>
          {projectTasks.map(({ $id, content, completed, due_date }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date}
              project={project}
            />
          ))}

          {fetcher.state !== 'idle' && <TaskCardSkeleton />}

          {!isFormShow && <TaskAddButton onClick={() => setIsFormShow(true)} />}

          {!projectTasks.length && !isFormShow && <TaskEmptyState type="project" />}

          {isFormShow && (
            <TaskForm
              className="mt-1"
              mode="create"
              onCancel={() => setIsFormShow(false)}
              defaultFormData={{
                content: '',
                due_date: null,
                projectId: project.$id,
              }}
              onSubmit={handleSubmitCreate}
            />
          )}
        </PageList>
      </Page>
    </>
  );
};

export default ProjectDetailPage;
