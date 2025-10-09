import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskAddButton } from '@/components/atoms/TaskAddButton';
import { TotalTasks } from '@/components/atoms/TotalTasks';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskEmptyState } from '@/components/organisms/TaskEmptyState';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useTaskOperations } from '@/hooks/use-taskOperations.tsx';
import { ITasksLoaderData } from '@/types/loader.types';
import { useState } from 'react';
import { useLoaderData } from 'react-router';

export const InboxPage = () => {
  const { tasks } = useLoaderData<ITasksLoaderData>();
  const { createTask } = useTaskOperations();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

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
          {tasks.total > 0 && <TotalTasks total={tasks.total} />}
        </PageHeader>

        <PageList aria-label="Inbox tasks">
          {tasks?.documents.map(({ $id, content, completed, due_date, project }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={project}
            />
          ))}

          {!isFormOpen && <TaskAddButton onClick={() => setIsFormOpen(true)} />}

          {!isFormOpen && !tasks.documents && <TaskEmptyState type="inbox" />}

          {isFormOpen && (
            <TaskForm
              className="mt-1"
              mode="create"
              onCancel={() => setIsFormOpen(false)}
              onSubmit={createTask}
            />
          )}
        </PageList>
      </Page>
    </>
  );
};
