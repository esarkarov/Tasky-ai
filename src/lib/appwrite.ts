import { env } from '@/config/env.config';
import { Client, Databases } from 'appwrite';

const client = new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId);

const databases = new Databases(client);

export { databases };
