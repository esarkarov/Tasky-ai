import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskAddButton } from '@/components/atoms/TaskAddButton';
import { TaskCardSkeleton } from '@/components/atoms/TaskCardSkeleton';
import { TaskEmptyState } from '@/components/atoms/TaskEmptyState';
import { TotalTasks } from '@/components/atoms/TotalTasks';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { HTTP_METHODS } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { ITasksLoaderData } from '@/types/loader.types';
import { ITaskFormData } from '@/types/task.types';
import { startOfToday } from 'date-fns';
import { useCallback, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

export const TodayPage = () => {
  const fetcher = useFetcher();
  const { tasks } = useLoaderData<ITasksLoaderData>();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  console.log(tasks);

  const handleSubmitCreate = useCallback(
    (formData: ITaskFormData) => {
      fetcher.submit(JSON.stringify(formData), {
        action: ROUTES.APP,
        method: HTTP_METHODS.POST,
        encType: 'application/json',
      });
    },
    [fetcher]
  );

  console.log(tasks);
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
          {tasks.documents.map(({ $id, content, completed, due_date, project }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={project}
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
              onSubmit={handleSubmitCreate}
            />
          )}
        </PageList>
      </Page>
    </>
  );
};
