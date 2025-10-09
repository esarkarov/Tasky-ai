import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { TotalCounter } from '@/components/atoms/TotalCounter';
import { ProjectSearchField } from '@/components/molecules/ProjectSearchField';
import { ProjectCard } from '@/components/organisms/ProjectCard';
import { ProjectFormDialog } from '@/components/organisms/ProjectFormDialog';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useProjectOperations } from '@/hooks/use-projectOperations';
import { cn } from '@/lib/utils';
import { IProjectsLoaderData } from '@/types/loader.types';
import { FolderKanban, Plus } from 'lucide-react';
import { useLoaderData } from 'react-router';

export const ProjectsPage = () => {
  const { fetcher, searchStatus, searchProjects } = useProjectOperations();
  const loaderData = useLoaderData<IProjectsLoaderData>();
  const fetcherData = fetcher.data as IProjectsLoaderData;
  const { projects } = fetcherData || loaderData;

  return (
    <>
      <Head title="Tasky AI | My Projects" />

      <TopAppBar
        title="My Projects"
        taskCount={projects.total}
      />

      <Page aria-labelledby="projects-page-title">
        <PageHeader>
          <div className="flex items-center gap-2">
            <PageTitle>My Projects</PageTitle>

            <ProjectFormDialog method="POST">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                aria-label="Create a new project">
                <Plus aria-hidden="true" />
              </Button>
            </ProjectFormDialog>
          </div>

          <fetcher.Form
            method="get"
            action={ROUTES.PROJECTS}
            role="search">
            <ProjectSearchField
              onSearchProjects={searchProjects}
              searchStatus={searchStatus}
            />
          </fetcher.Form>
        </PageHeader>

        <PageList aria-label="Project list">
          <div className="h-8 flex items-center border-b mb-1">
            <TotalCounter
              total={projects.total}
              label="project"
              icon={FolderKanban}
            />
          </div>

          <div className={cn(searchStatus === 'searching' && 'opacity-25')}>
            {projects.documents.map((project) => (
              <ProjectCard
                key={project.$id}
                project={project}
              />
            ))}

            {projects.total === 0 && (
              <p
                className="h-14 flex justify-center items-center text-muted-foreground"
                role="status">
                No project found
              </p>
            )}
          </div>
        </PageList>
      </Page>
    </>
  );
};
