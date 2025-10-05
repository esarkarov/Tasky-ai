import { type PropsWithChildren, memo } from 'react';

const Page: React.FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <main
      className="container md:max-w-screen-lg"
      role="main"
      aria-label="Page content">
      {children}
    </main>
  );
});

const PageHeader: React.FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <header
      className="pt-2 pb-3 space-y-2 md:px-4 lg:px-10"
      role="banner"
      aria-label="Page header">
      {children}
    </header>
  );
});

const PageTitle: React.FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <h1
      className="text-2xl font-semibold"
      id="page-title">
      {children}
    </h1>
  );
});

const PageList: React.FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <section
      className="pt-2 pb-20 md:px-4 lg:px-10"
      role="region"
      aria-labelledby="page-title">
      {children}
    </section>
  );
});

Page.displayName = 'Page';
PageTitle.displayName = 'PageTitle';
PageHeader.displayName = 'PageHeader';
PageList.displayName = 'PageList';

export { Page, PageHeader, PageTitle, PageList };
