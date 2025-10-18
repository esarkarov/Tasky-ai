import { z } from 'zod';

const envSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().nonempty(),
  VITE_CLERK_USER_STORAGE_KEY: z.string().nonempty(),
  VITE_APPWRITE_PROJECT_ID: z.string().nonempty(),
  VITE_APPWRITE_TASKS_COLLECTION_ID: z.string().nonempty(),
  VITE_APPWRITE_PROJECTS_COLLECTION_ID: z.string().nonempty(),
  VITE_APPWRITE_ENDPOINT: z.string().nonempty(),
  VITE_APPWRITE_DATABASE_ID: z.string().nonempty(),
  VITE_GEMINI_API_KEY: z.string().nonempty(),
});

export const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  throw new Error('Invalid environment configuration');
}

export const env = {
  clerkPublishableKey: parsedEnv.data.VITE_CLERK_PUBLISHABLE_KEY,
  clerkUserStorageKey: parsedEnv.data.VITE_CLERK_USER_STORAGE_KEY,
  appwriteProjectsCollectionId: parsedEnv.data.VITE_APPWRITE_PROJECTS_COLLECTION_ID,
  appwriteTasksCollectionId: parsedEnv.data.VITE_APPWRITE_TASKS_COLLECTION_ID,
  appwriteProjectId: parsedEnv.data.VITE_APPWRITE_PROJECT_ID,
  appwriteEndpoint: parsedEnv.data.VITE_APPWRITE_ENDPOINT,
  appwriteDatabaseId: parsedEnv.data.VITE_APPWRITE_DATABASE_ID,
  geminiApiKey: parsedEnv.data.VITE_GEMINI_API_KEY,
};
