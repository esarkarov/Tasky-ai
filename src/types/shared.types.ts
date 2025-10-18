import { Models } from 'appwrite';

export type CrudMode = 'create' | 'update';
export type EntityType = 'task' | 'project';
export type HttpMethod = 'POST' | 'PUT';
export type EmptyStateVariant = 'today' | 'inbox' | 'upcoming' | 'completed' | 'project';
export type SearchStatus = 'idle' | 'loading' | 'searching';
export interface BaseEntity extends Models.Document {
  $id: string;
  $createdAt: string;
}
