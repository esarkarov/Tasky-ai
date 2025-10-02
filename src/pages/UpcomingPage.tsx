import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskEmptyState } from '@/components/atoms/TaskEmptyState';
import { TotalTasks } from '@/components/atoms/TotalTasks';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import type { Models } from 'appwrite';
import { useLoaderData } from 'react-router';

const UpcomingPage = () => {
  const { tasks } = useLoaderData<{
    tasks: Models.DocumentList<Models.Document>;
  }>();

  return (
    <>
      <Head title="Tasky AI | Upcoming" />

      <TopAppBar
        title="Upcoming"
        taskCount={tasks.total}
      />

      <Page>
        <PageHeader>
          <PageTitle>Upcoming</PageTitle>

          {tasks.total > 0 && <TotalTasks total={tasks.total} />}
        </PageHeader>

        <PageList>
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

          {!tasks.total && <TaskEmptyState type="upcoming" />}
        </PageList>
      </Page>
    </>
  );
};

export default UpcomingPage;
