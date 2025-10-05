import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TaskEmptyState } from '@/components/atoms/TaskEmptyState';
import { TotalTasks } from '@/components/atoms/TotalTasks';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { ITasksLoaderData } from '@/types/loader.types';
import { IProject } from '@/types/project.types';
import { useLoaderData } from 'react-router';

export const CompletedPage = () => {
  const { tasks } = useLoaderData<ITasksLoaderData>();

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
          {tasks.total > 0 && <TotalTasks total={tasks.total} />}
        </PageHeader>

        <PageList aria-label="Completed tasks">
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

          {!tasks.total && <TaskEmptyState type="completed" />}
        </PageList>
      </Page>
    </>
  );
};
