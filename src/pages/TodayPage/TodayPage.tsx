import { AddTaskButton } from '@/components/atoms/AddTaskButton';
import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useTaskOperations } from '@/hooks/use-taskOperations.tsx';
import { TasksLoaderData } from '@/types/loader.types';
import { Project } from '@/types/project.types';
import { startOfToday } from 'date-fns';
import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';

export const TodayPage = () => {
  const { createTask } = useTaskOperations();
  const {
    tasks: { total, documents },
  } = useLoaderData<TasksLoaderData>();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <>
      <Head title="Tasky AI | Today" />

      <TopAppBar
        title="Today"
        taskCount={total}
      />

      <Page aria-labelledby="today-page-title">
        <PageHeader>
          <PageTitle>Today</PageTitle>
          {total > 0 && (
            <TotalCounter
              total={total}
              label="task"
              icon={ClipboardCheck}
            />
          )}
        </PageHeader>

        <PageList aria-label="Today's tasks">
          {documents?.map(({ $id, content, completed, due_date, projectId }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={projectId as Project}
            />
          ))}

          {!isFormOpen && (
            <AddTaskButton
              onClick={() => setIsFormOpen(true)}
              aria-label="Add new task for today"
            />
          )}

          {!total && !isFormOpen && <EmptyStateMessage variant="today" />}

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
