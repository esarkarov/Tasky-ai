import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskEmptyState } from '@/components/atoms/TaskEmptyState';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import type { Models } from 'appwrite';
import { useLoaderData } from 'react-router';

export const CompletedPage = () => {
  const { tasks } = useLoaderData<{
    tasks: Models.DocumentList<Models.Document>;
  }>();

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
        </PageHeader>

        <PageList aria-label="Completed tasks">
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

          {!tasks.total && <TaskEmptyState type="completed" />}
        </PageList>
      </Page>
    </>
  );
};
