import { AddTaskButton } from '@/components/atoms/AddTaskButton';
import { Head } from '@/components/atoms/Head';
import { LoadMoreButton } from '@/components/atoms/LoadMoreButton';
import { PageContainer, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { EmptyStateMessage } from '@/components/organisms/EmptyStateMessage';
import { ProjectActionMenu } from '@/components/organisms/ProjectActionMenu';
import { TaskCard } from '@/components/organisms/TaskCard';
import { TaskForm } from '@/components/organisms/TaskForm';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { Button } from '@/components/ui/button';
import { useLoadMore } from '@/hooks/use-load-more';
import { useTaskOperations } from '@/hooks/use-task-operations';
import { ProjectDetailLoaderData } from '@/types/loaders.types';
import type { Models } from 'appwrite';
import { ClipboardCheck, MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';

export const ProjectDetailPage = () => {
  const [isFormShow, setIsFormShow] = useState(false);
  const { project } = useLoaderData<ProjectDetailLoaderData>();
  const { tasks, name, color_hex, color_name, $id } = project;
  const { handleCreateTask } = useTaskOperations();

  const filteredProjectTasks = useMemo(() => {
    const incompleteTasks = tasks?.filter((task: Models.Document) => !task.completed) as Models.Document[];

    const sortedTasks = incompleteTasks?.sort((taskA, taskB) => {
      const dateA = new Date(taskA.due_date);
      const dateB = new Date(taskB.due_date);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedTasks;
  }, [tasks]);

  const {
    items: visibleProjectTasks,
    isLoading,
    hasMore,
    handleLoadMore,
    getItemClassName,
    getItemStyle,
  } = useLoadMore(filteredProjectTasks || []);

  return (
    <>
      <Head title={`Tasky AI | ${name}`} />

      <TopAppBar
        title={name}
        totalCount={filteredProjectTasks?.length}
      />

      <PageContainer aria-labelledby="project-detail-title">
        <PageHeader>
          <div className="flex items-center gap-2">
            <PageTitle>{name}</PageTitle>

            <ProjectActionMenu
              defaultValues={{
                id: $id,
                name: name,
                color_name: color_name,
                color_hex: color_hex,
              }}>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 shrink-0"
                aria-label={`More actions for project ${name}`}>
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </ProjectActionMenu>
          </div>
          {filteredProjectTasks?.length > 0 && (
            <TotalCounter
              totalCount={filteredProjectTasks?.length}
              icon={ClipboardCheck}
            />
          )}
        </PageHeader>

        <PageList aria-label={`Tasks for project ${name}`}>
          {visibleProjectTasks?.map(({ $id, content, completed, due_date }, index) => (
            <div
              key={$id}
              className={getItemClassName(index)}
              style={getItemStyle(index)}>
              <TaskCard
                key={$id}
                id={$id}
                content={content}
                completed={completed}
                dueDate={due_date}
                project={project}
              />
            </div>
          ))}

          {!isFormShow && (
            <AddTaskButton
              onClick={() => setIsFormShow(true)}
              aria-label="Add new task to this project"
            />
          )}

          {!filteredProjectTasks?.length && !isFormShow && <EmptyStateMessage variant="project" />}

          {isFormShow && (
            <TaskForm
              className="mt-1"
              mode="create"
              defaultValues={{
                content: '',
                due_date: null,
                projectId: $id,
              }}
              handleCancel={() => setIsFormShow(false)}
              onSubmit={handleCreateTask}
            />
          )}

          {hasMore && (
            <div className="flex justify-center py-6">
              <LoadMoreButton
                loading={isLoading}
                onClick={handleLoadMore}
              />
            </div>
          )}
        </PageList>
      </PageContainer>
    </>
  );
};
