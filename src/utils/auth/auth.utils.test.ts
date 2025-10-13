import { env } from '@/config/env.config';
import { ROUTES } from '@/constants/routes';
import { getUserId } from '@/utils/auth/auth.utils';
import { redirect } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env.config', () => ({
  env: {
    clerkUserStorageKey: 'clerk-user-key',
  },
}));

vi.mock('@/constants/routes', () => ({
  ROUTES: {
    AUTH_SYNC: '/auth/sync',
  },
}));

vi.mock('react-router', () => ({
  redirect: vi.fn(),
}));

const mockedEnv = vi.mocked(env);
const mockedRedirect = vi.mocked(redirect);

describe('auth utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
    vi.spyOn(sessionStorage, 'getItem');
    vi.spyOn(sessionStorage, 'setItem');
    vi.spyOn(sessionStorage, 'removeItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUserId', () => {
    it('should return user ID when clerk user ID exists in sessionStorage', () => {
      const mockUserId = 'user-123';
      sessionStorage.setItem(mockedEnv.clerkUserStorageKey, mockUserId);

      const result = getUserId();

      expect(result).toBe(mockUserId);
      expect(mockedRedirect).not.toHaveBeenCalled();
    });

    it('should redirect to auth sync and return empty string when clerk user ID does not exist', () => {
      sessionStorage.removeItem(mockedEnv.clerkUserStorageKey);

      const result = getUserId();

      expect(result).toBe('');
      expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.AUTH_SYNC);
    });

    it('should redirect to auth sync and return empty string when clerk user ID is empty string', () => {
      sessionStorage.setItem(mockedEnv.clerkUserStorageKey, '');

      const result = getUserId();

      expect(result).toBe('');
      expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.AUTH_SYNC);
    });

    it('should use the correct storage key from environment config', () => {
      const mockUserId = 'user-123';
      sessionStorage.setItem(mockedEnv.clerkUserStorageKey, mockUserId);

      expect(sessionStorage.getItem(mockedEnv.clerkUserStorageKey)).toBe(mockUserId);
    });
  });
});
