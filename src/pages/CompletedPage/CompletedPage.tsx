import { Head } from '@/components/atoms/Head';
import { LoadMoreButton } from '@/components/atoms/LoadMoreButton';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { FilterSelect } from '@/components/organisms/FilterSelect';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useLoadMore } from '@/hooks/use-load-more';
import { useProjectFilter } from '@/hooks/use-project-filter';
import { ProjectTaskLoaderData } from '@/types/loaders.types';
import { ProjectEntity } from '@/types/projects.types';
import { ClipboardCheck } from 'lucide-react';
import { useLoaderData } from 'react-router';

export const CompletedPage = () => {
  const {
    tasks: { total, documents: taskDocs },
    projects: { documents: projectDocs },
  } = useLoaderData<ProjectTaskLoaderData>();
  const { filteredTasks, filteredCount, selectedProjectId, setSelectedProjectId } = useProjectFilter({ taskDocs });
  const {
    visibleItems: visibleTasks,
    isLoading,
    hasMore,
    handleLoadMore,
    getItemClassName,
    getItemStyle,
  } = useLoadMore(filteredTasks || []);

  return (
    <>
      <Head title="Tasky AI | Completed" />

      <TopAppBar
        title="Completed"
        taskCount={total}
      />

      <Page aria-labelledby="completed-page-title">
        <PageHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <PageTitle>Completed</PageTitle>
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

        <PageList aria-label="Completed tasks">
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

          {!filteredCount && <EmptyStateMessage variant="completed" />}

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
