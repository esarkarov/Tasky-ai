import { AddTaskButton } from '@/components/atoms/AddTaskButton';
import { Head } from '@/components/atoms/Head';
import { LoadMoreButton } from '@/components/atoms/LoadMoreButton';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useLoadMore } from '@/hooks/use-load-more';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { TasksLoaderData } from '@/types/loaders.types';
import { ProjectEntity } from '@/types/projects.types';
import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';

export const InboxPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {
    tasks: { total, documents: taskDocs },
  } = useLoaderData<TasksLoaderData>();
  const {
    visibleItems: visibleTasks,
    isLoading,
    hasMore,
    handleLoadMore,
    getItemClassName,
    getItemStyle,
  } = useLoadMore(taskDocs || []);
  const { createTask } = useTaskOperations();

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
          {visibleTasks.map(({ $id, content, completed, due_date, projectId }, index) => (
            <div
              key={$id}
              className={getItemClassName(index)}
              style={getItemStyle(index)}>
              <TaskCard
                id={$id}
                content={content}
                completed={completed}
                dueDate={due_date as Date}
                project={projectId as ProjectEntity}
              />
            </div>
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

          {hasMore && (
            <div className="flex justify-center py-6">
              <LoadMoreButton
                isLoading={isLoading}
                handleLoadMore={handleLoadMore}
              />
            </div>
          )}
        </PageList>
      </Page>
    </>
  );
};
