import { env } from '@/config/env.config';
import { ROUTES } from '@/constants/routes';
import { getUserId } from '@/utils/auth/auth.utils';
import { redirect } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

const mockedRedirect = vi.mocked(redirect);

describe('auth utils', () => {
  const STORAGE_KEY = env.clerkUserStorageKey;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('getUserId', () => {
    const setUserId = (userId: string | null) => {
      if (userId === null) {
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, userId);
      }
    };

    describe('when user ID exists in session storage', () => {
      it('should return the user ID and not redirect', () => {
        const mockUserId = 'user-123';
        setUserId(mockUserId);

        const result = getUserId();

        expect(result).toBe(mockUserId);
        expect(mockedRedirect).not.toHaveBeenCalled();
      });
    });

    describe('when user ID is missing or invalid', () => {
      it.each([
        { scenario: 'not present', userId: null },
        { scenario: 'empty string', userId: '' },
      ])('should redirect to auth sync when user ID is $scenario', ({ userId }) => {
        setUserId(userId);

        const result = getUserId();

        expect(result).toBe('');
        expect(mockedRedirect).toHaveBeenCalledWith(ROUTES.AUTH_SYNC);
      });
    });

    describe('storage key configuration', () => {
      it('should use the storage key from environment config', () => {
        const mockUserId = 'user-456';
        setUserId(mockUserId);

        getUserId();

        expect(sessionStorage.getItem(STORAGE_KEY)).toBe(mockUserId);
      });
    });
  });
});
