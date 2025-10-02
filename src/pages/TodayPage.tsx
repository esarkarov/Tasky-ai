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
import { ITaskForm } from '@/interfaces';
import type { Models } from 'appwrite';
import { startOfToday } from 'date-fns';
import { useCallback, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

const TodayPage = () => {
  const fetcher = useFetcher();
  const { tasks } = useLoaderData<{
    tasks: Models.DocumentList<Models.Document>;
  }>();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

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
      <Head title="Tasky AI | Today" />

      <TopAppBar
        title="Today"
        taskCount={tasks.total}
      />

      <Page>
        <PageHeader>
          <PageTitle>Today</PageTitle>

          {tasks.total > 0 && <TotalTasks total={tasks.total} />}
        </PageHeader>

        <PageList>
          {tasks.documents.map(({ $id, content, completed, due_date, project }) => (
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

          {!isFormOpen && <TaskAddButton onClick={() => setIsFormOpen(true)} />}

          {!tasks.total && !isFormOpen && <TaskEmptyState />}

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

export default TodayPage;
