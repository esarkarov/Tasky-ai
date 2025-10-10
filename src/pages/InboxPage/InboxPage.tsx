import { AddTaskButton } from '@/components/atoms/AddTaskButton';
import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { TasksLoaderData } from '@/types/loaders.types';
import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';

export const InboxPage = () => {
  const {
    tasks: { total, documents },
  } = useLoaderData<TasksLoaderData>();
  const { createTask } = useTaskOperations();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <>
      <Head title="Tasky AI | Inbox" />

      <TopAppBar
        title="Inbox"
        taskCount={total}
      />

      <Page aria-labelledby="inbox-page-title">
        <PageHeader>
          <PageTitle>Inbox</PageTitle>
          {total > 0 && (
            <TotalCounter
              total={total}
              label="task"
              icon={ClipboardCheck}
            />
          )}
        </PageHeader>

        <PageList aria-label="Inbox tasks">
          {documents?.map(({ $id, content, completed, due_date, project }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={project}
            />
          ))}

          {!isFormOpen && <AddTaskButton onClick={() => setIsFormOpen(true)} />}

          {!total && !isFormOpen && <EmptyStateMessage variant="inbox" />}

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
