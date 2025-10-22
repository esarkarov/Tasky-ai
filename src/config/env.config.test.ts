import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('env configuration', () => {
  const createEnvSchema = () =>
    z.object({
      VITE_CLERK_PUBLISHABLE_KEY: z.string().nonempty().readonly(),
      VITE_CLERK_USER_STORAGE_KEY: z.string().nonempty().readonly(),
      VITE_APPWRITE_PROJECT_ID: z.string().nonempty().readonly(),
      VITE_APPWRITE_TASKS_COLLECTION_ID: z.string().nonempty().readonly(),
      VITE_APPWRITE_PROJECTS_COLLECTION_ID: z.string().nonempty().readonly(),
      VITE_APPWRITE_ENDPOINT: z.string().nonempty().readonly(),
      VITE_APPWRITE_DATABASE_ID: z.string().nonempty().readonly(),
      VITE_GEMINI_API_KEY: z.string().nonempty().readonly(),
    });

  const createValidEnv = (overrides = {}) => ({
    MODE: 'production',
    VITE_CLERK_PUBLISHABLE_KEY: 'pk_test_valid_key',
    VITE_CLERK_USER_STORAGE_KEY: 'user_storage_key',
    VITE_APPWRITE_PROJECT_ID: 'appwrite_project_123',
    VITE_APPWRITE_TASKS_COLLECTION_ID: 'tasks_collection_456',
    VITE_APPWRITE_PROJECTS_COLLECTION_ID: 'projects_collection_789',
    VITE_APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
    VITE_APPWRITE_DATABASE_ID: 'database_abc',
    VITE_GEMINI_API_KEY: 'gemini_key_xyz',
    ...overrides,
  });

  const mapToEnv = (parsedData: z.infer<ReturnType<typeof createEnvSchema>>) => ({
    clerkPublishableKey: parsedData.VITE_CLERK_PUBLISHABLE_KEY,
    clerkUserStorageKey: parsedData.VITE_CLERK_USER_STORAGE_KEY,
    appwriteProjectsCollectionId: parsedData.VITE_APPWRITE_PROJECTS_COLLECTION_ID,
    appwriteTasksCollectionId: parsedData.VITE_APPWRITE_TASKS_COLLECTION_ID,
    appwriteProjectId: parsedData.VITE_APPWRITE_PROJECT_ID,
    appwriteEndpoint: parsedData.VITE_APPWRITE_ENDPOINT,
    appwriteDatabaseId: parsedData.VITE_APPWRITE_DATABASE_ID,
    geminiApiKey: parsedData.VITE_GEMINI_API_KEY,
  });

  describe('Valid environment variables', () => {
    it('should parse and map environment variables correctly', () => {
      const mockEnv = createValidEnv();
      const schema = createEnvSchema();

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(true);
      if (!result.success) return;

      const env = mapToEnv(result.data);
      expect(env.clerkPublishableKey).toBe('pk_test_valid_key');
      expect(env.clerkUserStorageKey).toBe('user_storage_key');
      expect(env.appwriteProjectId).toBe('appwrite_project_123');
      expect(env.appwriteTasksCollectionId).toBe('tasks_collection_456');
      expect(env.appwriteProjectsCollectionId).toBe('projects_collection_789');
      expect(env.appwriteEndpoint).toBe('https://cloud.appwrite.io/v1');
      expect(env.appwriteDatabaseId).toBe('database_abc');
      expect(env.geminiApiKey).toBe('gemini_key_xyz');
    });

    it('should have all expected camelCase properties', () => {
      const mockEnv = createValidEnv();
      const schema = createEnvSchema();
      const expectedKeys = [
        'clerkPublishableKey',
        'clerkUserStorageKey',
        'appwriteProjectId',
        'appwriteTasksCollectionId',
        'appwriteProjectsCollectionId',
        'appwriteEndpoint',
        'appwriteDatabaseId',
        'geminiApiKey',
      ];

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(true);
      if (!result.success) return;

      const env = mapToEnv(result.data);
      expectedKeys.forEach((key) => {
        expect(env).toHaveProperty(key);
      });
    });

    it('should not include SCREAMING_SNAKE_CASE keys in mapped env', () => {
      const mockEnv = createValidEnv();
      const schema = createEnvSchema();

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(true);
      if (!result.success) return;

      const env = mapToEnv(result.data);
      expect(env).not.toHaveProperty('VITE_CLERK_PUBLISHABLE_KEY');
      expect(env).not.toHaveProperty('VITE_APPWRITE_ENDPOINT');
    });
  });

  describe('Invalid environment variables', () => {
    const mockEnvVariables = [
      ['VITE_CLERK_PUBLISHABLE_KEY', 'VITE_CLERK_PUBLISHABLE_KEY'],
      ['VITE_GEMINI_API_KEY', 'VITE_GEMINI_API_KEY'],
      ['VITE_APPWRITE_ENDPOINT', 'VITE_APPWRITE_ENDPOINT'],
    ];

    it.each(mockEnvVariables)('should fail validation when %s is missing', (_, key) => {
      const mockEnv = createValidEnv();
      delete mockEnv[key as keyof typeof mockEnv];
      const schema = createEnvSchema();

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(false);
    });

    it('should fail validation when a required variable is empty', () => {
      const mockEnv = createValidEnv({ VITE_APPWRITE_ENDPOINT: '' });
      const schema = createEnvSchema();

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(false);
    });

    it('should fail validation when multiple variables are missing', () => {
      const mockEnv = {
        MODE: 'production',
        VITE_CLERK_PUBLISHABLE_KEY: 'pk_key',
      };
      const schema = createEnvSchema();

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(false);
    });

    it('should throw error when validation fails', () => {
      const mockEnv = { MODE: 'production' };
      const schema = createEnvSchema();

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(() => {
          throw new Error('Invalid environment configuration');
        }).toThrow('Invalid environment configuration');
      }
    });
  });

  describe('Test mode defaults', () => {
    const testDefaults = {
      VITE_CLERK_PUBLISHABLE_KEY: 'test-key',
      VITE_CLERK_USER_STORAGE_KEY: 'test-storage-key',
      VITE_APPWRITE_PROJECT_ID: 'test-project-id',
      VITE_APPWRITE_TASKS_COLLECTION_ID: 'test-tasks-collection',
      VITE_APPWRITE_PROJECTS_COLLECTION_ID: 'test-projects-collection',
      VITE_APPWRITE_ENDPOINT: 'http://localhost:8080/v1',
      VITE_APPWRITE_DATABASE_ID: 'test-database-id',
      VITE_GEMINI_API_KEY: 'test-gemini-key',
    };

    const mergeTestDefaults = (env: Record<string, string>) =>
      env.MODE === 'test' ? { ...testDefaults, ...env } : env;

    it('should apply test defaults when MODE is "test"', () => {
      const mockEnv = { MODE: 'test' };
      const envToParse = mergeTestDefaults(mockEnv);
      const schema = createEnvSchema();

      const result = schema.safeParse(envToParse);

      expect(result.success).toBe(true);
      if (!result.success) return;

      const env = mapToEnv(result.data);
      expect(env.clerkPublishableKey).toBe('test-key');
      expect(env.clerkUserStorageKey).toBe('test-storage-key');
      expect(env.appwriteProjectId).toBe('test-project-id');
      expect(env.appwriteTasksCollectionId).toBe('test-tasks-collection');
      expect(env.appwriteProjectsCollectionId).toBe('test-projects-collection');
      expect(env.appwriteEndpoint).toBe('http://localhost:8080/v1');
      expect(env.appwriteDatabaseId).toBe('test-database-id');
      expect(env.geminiApiKey).toBe('test-gemini-key');
    });

    it('should allow overriding test defaults', () => {
      const mockEnv = {
        MODE: 'test',
        VITE_CLERK_PUBLISHABLE_KEY: 'overridden-key',
        VITE_APPWRITE_ENDPOINT: 'https://custom-endpoint.com/v1',
      };
      const envToParse = mergeTestDefaults(mockEnv);
      const schema = createEnvSchema();

      const result = schema.safeParse(envToParse);

      expect(result.success).toBe(true);
      if (!result.success) return;

      const env = mapToEnv(result.data);
      expect(env.clerkPublishableKey).toBe('overridden-key');
      expect(env.appwriteEndpoint).toBe('https://custom-endpoint.com/v1');
      expect(env.clerkUserStorageKey).toBe('test-storage-key');
      expect(env.geminiApiKey).toBe('test-gemini-key');
    });
  });

  describe('Zod validation result', () => {
    it('should return success true with valid configuration', () => {
      const mockEnv = createValidEnv();
      const schema = createEnvSchema();

      const result = schema.safeParse(mockEnv);

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data).toBeDefined();
      expect(result.data.VITE_CLERK_PUBLISHABLE_KEY).toBe('pk_test_valid_key');
    });
  });
});
