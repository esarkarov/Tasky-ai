import { env } from '@/config/env.config';
import { ROUTES } from '@/constants/routes';
import { redirect } from 'react-router';

export function getUserId(): string {
  const clerkUserId = sessionStorage.getItem(env.clerkUserStorageKey);

  if (!clerkUserId) {
    redirect(ROUTES.AUTH_SYNC);
    return '';
  }

  return clerkUserId;
}
