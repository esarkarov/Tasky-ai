import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { ITasksLoaderData } from '@/types/loader.types';
import { IProject } from '@/types/project.types';
import { ClipboardCheck } from 'lucide-react';
import { useLoaderData } from 'react-router';

export const UpcomingPage = () => {
  const { tasks } = useLoaderData<ITasksLoaderData>();

  return (
    <>
      <Head title="Tasky AI | Upcoming" />

      <TopAppBar
        title="Upcoming"
        taskCount={tasks.total}
      />

      <Page aria-labelledby="upcoming-page-title">
        <PageHeader>
          <PageTitle>Upcoming</PageTitle>
          {tasks.total > 0 && (
            <TotalCounter
              total={tasks.total}
              label="task"
              icon={ClipboardCheck}
            />
          )}
        </PageHeader>

        <PageList aria-label="Upcoming tasks">
          {tasks?.documents.map(({ $id, content, completed, due_date, projectId }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={projectId as IProject}
            />
          ))}

          {!tasks.total && <EmptyStateMessage type="upcoming" />}
        </PageList>
      </Page>
    </>
  );
};
