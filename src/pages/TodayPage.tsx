import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskAddButton } from '@/components/atoms/TaskAddButton';
import { TaskCardSkeleton } from '@/components/atoms/TaskCardSkeleton';
import { TotalTasks } from '@/components/atoms/TotalTasks';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskEmptyState } from '@/components/organisms/TaskEmptyState';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useTaskOperations } from '@/hooks/use-taskOperations';
import { ITasksLoaderData } from '@/types/loader.types';
import { IProject } from '@/types/project.types';
import { startOfToday } from 'date-fns';
import { useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

export const TodayPage = () => {
  const fetcher = useFetcher();
  const { createTask } = useTaskOperations();
  const { tasks } = useLoaderData<ITasksLoaderData>();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <>
      <Head title="Tasky AI | Today" />

      <TopAppBar
        title="Today"
        taskCount={tasks.total}
      />

      <Page aria-labelledby="today-page-title">
        <PageHeader>
          <PageTitle>Today</PageTitle>
          {tasks.total > 0 && <TotalTasks total={tasks.total} />}
        </PageHeader>

        <PageList aria-label="Today's tasks">
          {tasks.documents.map(({ $id, content, completed, due_date, projectId }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={projectId as IProject}
            />
          ))}

          {fetcher.state !== 'idle' && <TaskCardSkeleton />}

          {!isFormOpen && (
            <TaskAddButton
              onClick={() => setIsFormOpen(true)}
              aria-label="Add new task for today"
            />
          )}

          {!tasks.total && !isFormOpen && <TaskEmptyState type="today" />}

          {isFormOpen && (
            <TaskForm
              className="mt-1"
              mode="create"
              defaultFormData={{
                content: '',
                due_date: startOfToday(),
                projectId: null,
              }}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={createTask}
            />
          )}
        </PageList>
      </Page>
    </>
  );
};
