import { Models } from 'appwrite';

export type TActionMode = 'create' | 'edit';
export type TItemType = 'task' | 'project';
export type TActionMethod = 'POST' | 'PUT';
export type TEmptyStateType = 'today' | 'inbox' | 'upcoming' | 'completed' | 'project';
export type TSearchingState = 'idle' | 'loading' | 'searching';
export type TProjectList = Models.DocumentList<Models.Document> | null;
