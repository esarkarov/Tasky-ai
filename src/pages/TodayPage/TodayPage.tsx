import { AddTaskButton } from '@/components/atoms/AddTaskButton';
import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { FilterSelect } from '@/components/organisms/FilterSelect';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useProjectFilter } from '@/hooks/use-project-filter';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { ProjectTaskLoaderData } from '@/types/loaders.types';
import { ProjectEntity } from '@/types/projects.types';
import { startOfToday } from 'date-fns';
import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';

export const TodayPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const { createTask } = useTaskOperations();
  const {
    tasks: { total, documents: taskDocs },
    projects: { documents: projectDocs },
  } = useLoaderData<ProjectTaskLoaderData>();
  const { filteredTasks, filteredCount } = useProjectFilter({
    tasks: taskDocs,
    selectedProjectId,
  });

  return (
    <>
      <Head title="Tasky AI | Today" />

      <TopAppBar
        title="Today"
        taskCount={total}
      />

      <Page aria-labelledby="today-page-title">
        <PageHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <PageTitle>Today</PageTitle>
              {total > 0 && (
                <TotalCounter
                  total={total}
                  label="task"
                  icon={ClipboardCheck}
                />
              )}
            </div>
            <FilterSelect
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              projectDocs={projectDocs}
            />
          </div>
        </PageHeader>

        <PageList aria-label="Today's tasks">
          {filteredTasks?.map(({ $id, content, completed, due_date, projectId }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date as Date}
              project={projectId as ProjectEntity}
            />
          ))}

          {!isFormOpen && (
            <AddTaskButton
              onClick={() => setIsFormOpen(true)}
              aria-label="Add new task for today"
            />
          )}

          {!filteredCount && !isFormOpen && <EmptyStateMessage variant="today" />}

          {isFormOpen && (
            <TaskForm
              defaultFormData={{
                content: '',
                due_date: startOfToday(),
                projectId: null,
              }}
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
