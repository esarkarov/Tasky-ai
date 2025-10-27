import { env } from '@/config/env.config';
import { ROUTES } from '@/constants/routes';
import { redirect } from 'react-router';

export function getUserId(): string {
  const clerkUserId = localStorage.getItem(env.clerkUserStorageKey);

  if (!clerkUserId) {
    redirect(ROUTES.LOGIN);
    return '';
  }

  return clerkUserId;
}
