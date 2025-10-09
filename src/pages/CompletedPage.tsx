import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { TasksLoaderData } from '@/types/loader.types';
import { Project } from '@/types/project.types';
import { ClipboardCheck } from 'lucide-react';
import { useLoaderData } from 'react-router';

export const CompletedPage = () => {
  const { tasks } = useLoaderData<TasksLoaderData>();

  return (
    <>
      <Head title="Tasky AI | Completed" />

      <TopAppBar
        title="Completed"
        taskCount={tasks?.total}
      />

      <Page aria-labelledby="completed-page-title">
        <PageHeader>
          <PageTitle>Completed</PageTitle>
          {tasks.total > 0 && (
            <TotalCounter
              total={tasks.total}
              label="task"
              icon={ClipboardCheck}
            />
          )}
        </PageHeader>

        <PageList aria-label="Completed tasks">
          {tasks?.documents.map(({ $id, content, completed, due_date, projectId }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={projectId as Project}
            />
          ))}

          {!tasks.total && <EmptyStateMessage variant="completed" />}
        </PageList>
      </Page>
    </>
  );
};
