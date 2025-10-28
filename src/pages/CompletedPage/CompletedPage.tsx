import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { FilterSelect } from '@/components/organisms/FilterSelect';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { useProjectFilter } from '@/hooks/use-project-filter';
import { ProjectTaskLoaderData } from '@/types/loaders.types';
import { ProjectEntity } from '@/types/projects.types';
import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';

export const CompletedPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
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

          {!filteredCount && <EmptyStateMessage variant="completed" />}
        </PageList>
      </Page>
    </>
  );
};
