import { BaseEntity } from '../../store/types';

export interface Note extends BaseEntity {
  title: string;
  content: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate?: string;
  reminderDate?: string;
  color?: string;
  archived: boolean;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: string;
  reminderDate?: string;
  color?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: string;
  reminderDate?: string;
  color?: string;
  archived?: boolean;
}

export interface NotesFilter {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  archived?: boolean;
  tags?: string[];
  search?: string;
}

export interface NotesSortOptions {
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate';
  sortOrder: 'asc' | 'desc';
}

export interface NotesStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}