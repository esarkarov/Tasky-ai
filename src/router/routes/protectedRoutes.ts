import { ROUTES } from '@/constants/routes';
import {
  completedLoader,
  CompletedPage,
  inboxLoader,
  InboxPage,
  projectAction,
  projectDetailLoader,
  ProjectDetailPage,
  projectsLoader,
  ProjectsPage,
  todayLoader,
  TodayPage,
  upcomingLoader,
  UpcomingPage,
} from '@/router/lazy/lazy';
import { RouteObject } from 'react-router';

export const appRoutes: RouteObject[] = [
  {
    path: ROUTES.APP_PATHS.INBOX,
    lazy: {
      element: InboxPage,
      loader: inboxLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.TODAY,
    lazy: {
      element: TodayPage,
      loader: todayLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.UPCOMING,
    lazy: {
      element: UpcomingPage,
      loader: upcomingLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.COMPLETED,
    lazy: {
      element: CompletedPage,
      loader: completedLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.PROJECTS,
    lazy: {
      element: ProjectsPage,
      action: projectAction,
      loader: projectsLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.PROJECT_DETAIL,
    lazy: {
      element: ProjectDetailPage,
      loader: projectDetailLoader,
    },
  },
];
