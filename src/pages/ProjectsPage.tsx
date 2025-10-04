import { Head } from '@/components/atoms/Head';
import { Page, PageHeader, PageList, PageTitle } from '@/components/atoms/Page';
import { ProjectSearchField } from '@/components/atoms/ProjectSearchField';
import { ProjectCard } from '@/components/organisms/ProjectCard';
import { ProjectFormDialog } from '@/components/organisms/ProjectFormDialog';
import { TopAppBar } from '@/components/organisms/TopAppBar';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { TIMING } from '@/constants/timing';
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
      }, TIMING.DELAY_DURATION);

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

          <div className={cn(searchingState === 'searching' && 'opacity-25')}>
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
