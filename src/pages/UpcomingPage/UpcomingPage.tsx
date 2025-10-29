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

export const UpcomingPage = () => {
  const {
    tasks: { total, documents: taskDocs },
    projects: { documents: projectDocs },
  } = useLoaderData<ProjectTaskLoaderData>();
  const { filteredTasks, filteredCount, setSelectedProjectId, selectedProjectId } = useProjectFilter({
    tasks: taskDocs,
  });
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
      <Head title="Tasky AI | Upcoming" />

      <TopAppBar
        title="Upcoming"
        taskCount={total}
      />

      <Page aria-labelledby="upcoming-page-title">
        <PageHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <PageTitle>Upcoming</PageTitle>
              {total > 0 && (
                <TotalCounter
                  total={total}
                  label="task"
                  icon={ClipboardCheck}
                />
              )}
            </div>
            <FilterSelect
              projectDocs={projectDocs}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
            />
          </div>
        </PageHeader>

        <PageList aria-label="Upcoming tasks">
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

          {!filteredCount && <EmptyStateMessage variant="upcoming" />}

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
