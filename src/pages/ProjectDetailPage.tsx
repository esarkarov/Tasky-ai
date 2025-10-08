import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskAddButton } from '@/components/atoms/TaskAddButton';
import { TaskCardSkeleton } from '@/components/atoms/TaskCardSkeleton';
import { TotalTasks } from '@/components/atoms/TotalTasks';
import { ProjectActionMenu } from '@/components/organisms/ProjectActionMenu';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskEmptyState } from '@/components/organisms/TaskEmptyState';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-taskOperations';
import { IProjectDetailLoaderData } from '@/types/loader.types';
import type { Models } from 'appwrite';
import { MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

export const ProjectDetailPage = () => {
  const fetcher = useFetcher();
  const [isFormShow, setIsFormShow] = useState<boolean>(false);
  const { project } = useLoaderData<IProjectDetailLoaderData>();
  const { createTask } = useTaskOperations();

  const projectTasks = useMemo(() => {
    const incompleteTasks = project.tasks?.filter((task: Models.Document) => !task.completed) as Models.Document[];

    const sortedTasks = incompleteTasks.sort((taskA, taskB) => {
      const dateA = new Date(taskA.due_date);
      const dateB = new Date(taskB.due_date);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedTasks;
  }, [project.tasks]);

  return (
    <>
      <Head title={`Tasky AI | ${project.name}`} />

      <TopAppBar
        title={project.name}
        taskCount={projectTasks.length}
      />

      <Page aria-labelledby="project-detail-title">
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
                aria-label={`More actions for project ${project.name}`}>
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </ProjectActionMenu>
          </div>
          {projectTasks.length > 0 && <TotalTasks total={projectTasks.length} />}
        </PageHeader>

        <PageList aria-label={`Tasks for project ${project.name}`}>
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

          {!isFormShow && (
            <TaskAddButton
              onClick={() => setIsFormShow(true)}
              aria-label="Add new task to this project"
            />
          )}

          {!projectTasks.length && !isFormShow && <TaskEmptyState type="project" />}

          {isFormShow && (
            <TaskForm
              className="mt-1"
              mode="create"
              defaultFormData={{
                content: '',
                due_date: null,
                projectId: project.$id,
              }}
              onCancel={() => setIsFormShow(false)}
              onSubmit={createTask}
            />
          )}
        </PageList>
      </Page>
    </>
  );
};
