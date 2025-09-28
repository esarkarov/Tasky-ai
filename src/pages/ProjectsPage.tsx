import { Page, PageHeader, PageList, PageTitle } from '@/components/layout/Page';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import ProjectCard from '@/components/projects/ProjectCard';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { ProjectSearchField } from '@/components/projects/ProjectSearchField';
import { Head } from '@/components/shared/Head';
import { Button } from '@/components/ui/button';
import { ROUTES, TIMEOUT_DELAY } from '@/constants';
import { IDataType } from '@/interfaces';
import { cn } from '@/lib/utils';
import { TSearchingState } from '@/types';
import { Plus } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

const ProjectsPage = () => {
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as IDataType;
  const loaderData = useLoaderData() as IDataType;
  const { projects } = fetcherData || loaderData;
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [searchingState, setSearchingState] = useState<TSearchingState>('idle');

  const handleProjectSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      const submitTarget = e.currentTarget.form;

      searchTimeout.current = setTimeout(async () => {
        setSearchingState('searching');
        await fetcher.submit(submitTarget);
        setSearchingState('idle');
      }, TIMEOUT_DELAY);

      setSearchingState('loading');
    },
    [fetcher]
  );

  return (
    <>
      <Head title="Tasky AI | My Projects" />

      <TopAppBar title="My Projects" />

      <Page>
        <PageHeader>
          <div className="flex items-center gap-2">
            <PageTitle>My Projects</PageTitle>

            <ProjectFormDialog method="POST">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                aria-label="Create a project">
                <Plus />
              </Button>
            </ProjectFormDialog>
          </div>

          <fetcher.Form
            method="get"
            action={ROUTES.PROJECTS}>
            <ProjectSearchField
              handleChange={handleProjectSearch}
              searchingState={searchingState}
            />
          </fetcher.Form>
        </PageHeader>

        <PageList>
          <div className="h-8 flex items-center border-b">
            <div className="text-sm">{projects.total} projects</div>
          </div>

          <div className={cn('opacity-25')}>
            {projects.documents.map((project) => (
              <ProjectCard
                key={project.$id}
                project={project}
              />
            ))}

            {projects.total === 0 && (
              <div className="h-14 flex justify-center items-center text-muted-foreground">No project found</div>
            )}
          </div>
        </PageList>
      </Page>
    </>
  );
};

export default ProjectsPage;
