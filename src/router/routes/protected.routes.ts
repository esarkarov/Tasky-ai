import { ROUTES } from '@/constants/routes';
import {
  tasksCompletedLoader,
  CompletedPage,
  tasksInboxLoader,
  InboxPage,
  projectAction,
  projectDetailLoader,
  ProjectDetailPage,
  projectsLoader,
  ProjectsPage,
  tasksTodayLoader,
  TodayPage,
  tasksUpcomingLoader,
  UpcomingPage,
} from '@/router/lazy/router-lazy';
import { RouteObject } from 'react-router';

export const protectedRoutes: RouteObject[] = [
  {
    path: ROUTES.APP_PATHS.INBOX,
    lazy: {
      element: InboxPage,
      loader: tasksInboxLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.TODAY,
    lazy: {
      element: TodayPage,
      loader: tasksTodayLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.UPCOMING,
    lazy: {
      element: UpcomingPage,
      loader: tasksUpcomingLoader,
    },
  },
  {
    path: ROUTES.APP_PATHS.COMPLETED,
    lazy: {
      element: CompletedPage,
      loader: tasksCompletedLoader,
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
