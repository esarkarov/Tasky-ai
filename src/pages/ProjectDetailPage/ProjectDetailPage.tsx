import { AddTaskButton } from '@/components/atoms/AddTaskButton';
import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { ProjectActionMenu } from '@/components/organisms/ProjectActionMenu';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { Button } from '@/components/ui/button';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { ProjectDetailLoaderData } from '@/types/loaders.types';
import type { Models } from 'appwrite';
import { ClipboardCheck, MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';

export const ProjectDetailPage = () => {
  const [isFormShow, setIsFormShow] = useState<boolean>(false);
  const { project } = useLoaderData<ProjectDetailLoaderData>();
  const { createTask } = useTaskOperations();
  const { tasks, name, color_hex, color_name, $id } = project;

  const projectTasks = useMemo(() => {
    const incompleteTasks = tasks?.filter((task: Models.Document) => !task.completed) as Models.Document[];

    const sortedTasks = incompleteTasks?.sort((taskA, taskB) => {
      const dateA = new Date(taskA.due_date);
      const dateB = new Date(taskB.due_date);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedTasks;
  }, [tasks]);

  return (
    <>
      <Head title={`Tasky AI | ${name}`} />

      <TopAppBar
        title={name}
        taskCount={projectTasks?.length}
      />

      <Page aria-labelledby="project-detail-title">
        <PageHeader>
          <div className="flex items-center gap-2">
            <PageTitle>{name}</PageTitle>

            <ProjectActionMenu
              defaultFormData={{
                id: $id,
                name: name,
                color_name: color_name,
                color_hex: color_hex,
              }}>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 shrink-0"
                aria-label={`More actions for project ${name}`}>
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </ProjectActionMenu>
          </div>
          {projectTasks?.length > 0 && (
            <TotalCounter
              total={projectTasks?.length}
              label="task"
              icon={ClipboardCheck}
            />
          )}
        </PageHeader>

        <PageList aria-label={`Tasks for project ${name}`}>
          {projectTasks?.map(({ $id, content, completed, due_date }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date}
              project={project}
            />
          ))}

          {!isFormShow && (
            <AddTaskButton
              onClick={() => setIsFormShow(true)}
              aria-label="Add new task to this project"
            />
          )}

          {!projectTasks?.length && !isFormShow && <EmptyStateMessage variant="project" />}

          {isFormShow && (
            <TaskForm
              className="mt-1"
              mode="create"
              defaultFormData={{
                content: '',
                due_date: null,
                projectId: $id,
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
