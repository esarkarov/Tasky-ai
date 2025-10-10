import { createElement } from 'react';

export const RootTemplate = async () =>
  createElement((await import('@/components/templates/RootTemplate/RootTemplate')).RootTemplate);
export const AppTemplate = async () =>
  createElement((await import('@/components/templates/AppTemplate/AppTemplate')).AppTemplate);

export const HomePage = async () => createElement((await import('@/pages/HomePage/HomePage')).HomePage);
export const ErrorPage = async () => createElement((await import('@/pages/ErrorPage/ErrorPage')).ErrorPage);
export const LoginPage = async () => createElement((await import('@/pages/LoginPage/LoginPage')).LoginPage);
export const RegisterPage = async () => createElement((await import('@/pages/RegisterPage/RegisterPage')).RegisterPage);
export const AuthSyncPage = async () => createElement((await import('@/pages/AuthSyncPage/AuthSyncPage')).AuthSyncPage);
export const InboxPage = async () => createElement((await import('@/pages/InboxPage/InboxPage')).InboxPage);
export const TodayPage = async () => createElement((await import('@/pages/TodayPage/TodayPage')).TodayPage);
export const UpcomingPage = async () => createElement((await import('@/pages/UpcomingPage/UpcomingPage')).UpcomingPage);
export const CompletedPage = async () =>
  createElement((await import('@/pages/CompletedPage/CompletedPage')).CompletedPage);
export const ProjectsPage = async () => createElement((await import('@/pages/ProjectsPage/ProjectsPage')).ProjectsPage);
export const ProjectDetailPage = async () =>
  createElement((await import('@/pages/ProjectDetailPage/ProjectDetailPage')).ProjectDetailPage);

export const taskAction = async () => (await import('@/router/actions/task.action')).taskAction;
export const projectAction = async () => (await import('@/router/actions/project.action')).projectAction;

export const appLoader = async () => (await import('@/router/loaders/app.loader')).appLoader;
export const tasksCompletedLoader = async () =>
  (await import('@/router/loaders/tasks-completed.loader')).tasksCompletedLoader;
export const tasksInboxLoader = async () => (await import('@/router/loaders/tasks-inbox.loader')).tasksInboxLoader;
export const projectsLoader = async () => (await import('@/router/loaders/projects.loader')).projectsLoader;
export const tasksTodayLoader = async () => (await import('@/router/loaders/tasks-today.loader')).tasksTodayLoader;
export const tasksUpcomingLoader = async () =>
  (await import('@/router/loaders/tasks-upcoming.loader')).tasksUpcomingLoader;
export const projectDetailLoader = async () =>
  (await import('@/router/loaders/project-detail.loader')).projectDetailLoader;
