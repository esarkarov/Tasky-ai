import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskAddButton } from '@/components/atoms/TaskAddButton';
import { TaskCardSkeleton } from '@/components/atoms/TaskCardSkeleton';
import { TaskEmptyState } from '@/components/atoms/TaskEmptyState';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { TaskCard } from '@/components/organisms/TaskCard';
import { ITaskForm } from '@/interfaces';
import { Models } from 'appwrite';
import { useCallback, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';
import { ROUTES } from '@/constants/routes';
import { HTTP_METHODS } from '@/constants/http';

export const InboxPage = () => {
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
      <Head title="Tasky AI | Inbox" />

      <TopAppBar
        title="Inbox"
        taskCount={tasks?.total}
      />

      <Page aria-labelledby="inbox-page-title">
        <PageHeader>
          <PageTitle>Inbox</PageTitle>
        </PageHeader>

        <PageList aria-label="Inbox tasks">
          {tasks?.documents.map(({ $id, content, completed, due_date, project }) => (
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

          {!isFormOpen && !tasks.documents && <TaskEmptyState type="inbox" />}

          {isFormOpen && (
            <TaskForm
              className="mt-1"
              mode="create"
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleSubmitCreate}
            />
          )}
        </PageList>
      </Page>
    </>
  );
};
