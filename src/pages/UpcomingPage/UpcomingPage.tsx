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

export const UpcomingPage = () => {
  const {
    tasks: { total, documents },
  } = useLoaderData<TasksLoaderData>();

  return (
    <>
      <Head title="Tasky AI | Upcoming" />

      <TopAppBar
        title="Upcoming"
        taskCount={total}
      />

      <Page aria-labelledby="upcoming-page-title">
        <PageHeader>
          <PageTitle>Upcoming</PageTitle>
          {total > 0 && (
            <TotalCounter
              total={total}
              label="task"
              icon={ClipboardCheck}
            />
          )}
        </PageHeader>

        <PageList aria-label="Upcoming tasks">
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

          {!total && <EmptyStateMessage variant="upcoming" />}
        </PageList>
      </Page>
    </>
  );
};
