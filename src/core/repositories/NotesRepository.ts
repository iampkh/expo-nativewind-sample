import { BaseRepository, FindAllParams } from './types';
import { Note, CreateNoteData, UpdateNoteData, NotesFilter } from '../../shared/types/notes';
import { BaseEntity } from '../../store/types';
import { LocalCache } from '../storage/cache/LocalCache';

export class NotesRepository implements BaseRepository<Note> {
  private static readonly STORAGE_KEY = 'notes_storage';
  private localCache: LocalCache;
  private cache: Note[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.localCache = new LocalCache('notes_');
  }

  private generateId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createBaseEntity(): Pick<BaseEntity, keyof BaseEntity> {
    const now = new Date().toISOString();
    return {
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };
  }

  private isValidCache(): boolean {
    return this.cache !== null && (Date.now() - this.cacheTimestamp) < this.cacheTTL;
  }

  private async loadFromStorage(): Promise<Note[]> {
    try {
      if (this.isValidCache()) {
        return this.cache!;
      }

      const notes = await this.localCache.getObject<Note[]>(NotesRepository.STORAGE_KEY) || [];
      
      this.cache = notes;
      this.cacheTimestamp = Date.now();
      
      return notes;
    } catch (error) {
      console.error('Error loading notes from storage:', error);
      return [];
    }
  }

  private async saveToStorage(notes: Note[]): Promise<void> {
    try {
      await this.localCache.setObject(NotesRepository.STORAGE_KEY, notes);
      this.cache = notes;
      this.cacheTimestamp = Date.now();
    } catch (error) {
      console.error('Error saving notes to storage:', error);
      throw error;
    }
  }

  private applyFilters(notes: Note[], params?: FindAllParams): Note[] {
    let filtered = [...notes];

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (params?.filters) {
      const filters = params.filters as NotesFilter;
      
      if (filters.completed !== undefined) {
        filtered = filtered.filter(note => note.completed === filters.completed);
      }
      
      if (filters.priority) {
        filtered = filtered.filter(note => note.priority === filters.priority);
      }
      
      if (filters.archived !== undefined) {
        filtered = filtered.filter(note => note.archived === filters.archived);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(note => 
          filters.tags!.some(tag => note.tags.includes(tag))
        );
      }
    }

    return filtered;
  }

  private applySorting(notes: Note[], params?: FindAllParams): Note[] {
    const sortBy = params?.sortBy || 'updatedAt';
    const sortOrder = params?.sortOrder || 'desc';

    return notes.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Note];
      let bValue: any = b[sortBy as keyof Note];

      // Handle date strings
      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'dueDate') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Handle priority
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private applyPagination(notes: Note[], params?: FindAllParams): Note[] {
    if (!params?.page || !params?.limit) return notes;
    
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    
    return notes.slice(start, end);
  }

  async findAll(params?: FindAllParams): Promise<Note[]> {
    const notes = await this.loadFromStorage();
    let result = this.applyFilters(notes, params);
    result = this.applySorting(result, params);
    result = this.applyPagination(result, params);
    
    return result;
  }

  async findById(id: string): Promise<Note | null> {
    const notes = await this.loadFromStorage();
    return notes.find(note => note.id === id) || null;
  }

  async findOne(criteria: Partial<Note>): Promise<Note | null> {
    const notes = await this.loadFromStorage();
    return notes.find(note => {
      return Object.entries(criteria).every(([key, value]) => {
        return note[key as keyof Note] === value;
      });
    }) || null;
  }

  async create(data: Omit<Note, keyof BaseEntity>): Promise<Note> {
    const notes = await this.loadFromStorage();
    const newNote: Note = {
      ...this.createBaseEntity(),
      title: data.title,
      content: data.content || '',
      completed: data.completed || false,
      priority: data.priority || 'medium',
      tags: data.tags || [],
      dueDate: data.dueDate,
      reminderDate: data.reminderDate,
      color: data.color,
      archived: data.archived || false,
    };

    const updatedNotes = [...notes, newNote];
    await this.saveToStorage(updatedNotes);
    
    return newNote;
  }

  async update(id: string, data: Partial<Omit<Note, keyof BaseEntity>>): Promise<Note> {
    const notes = await this.loadFromStorage();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      throw new Error(`Note with id ${id} not found`);
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = updatedNote;
    
    await this.saveToStorage(updatedNotes);
    
    return updatedNote;
  }

  async delete(id: string): Promise<boolean> {
    const notes = await this.loadFromStorage();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) {
      return false; // Note not found
    }

    await this.saveToStorage(filteredNotes);
    return true;
  }

  async createMany(data: Omit<Note, keyof BaseEntity>[]): Promise<Note[]> {
    const notes = await this.loadFromStorage();
    const newNotes: Note[] = data.map(item => ({
      ...this.createBaseEntity(),
      title: item.title,
      content: item.content || '',
      completed: item.completed || false,
      priority: item.priority || 'medium',
      tags: item.tags || [],
      dueDate: item.dueDate,
      reminderDate: item.reminderDate,
      color: item.color,
      archived: item.archived || false,
    }));

    const updatedNotes = [...notes, ...newNotes];
    await this.saveToStorage(updatedNotes);
    
    return newNotes;
  }

  async updateMany(criteria: Partial<Note>, data: Partial<Omit<Note, keyof BaseEntity>>): Promise<Note[]> {
    const notes = await this.loadFromStorage();
    const updatedNotes: Note[] = [];
    
    const newNotes = notes.map(note => {
      const matches = Object.entries(criteria).every(([key, value]) => {
        return note[key as keyof Note] === value;
      });

      if (matches) {
        const updated = {
          ...note,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        updatedNotes.push(updated);
        return updated;
      }
      
      return note;
    });

    await this.saveToStorage(newNotes);
    return updatedNotes;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const notes = await this.loadFromStorage();
    const filteredNotes = notes.filter(note => !ids.includes(note.id));
    
    await this.saveToStorage(filteredNotes);
    return true;
  }

  // Additional methods specific to notes
  async toggleComplete(id: string): Promise<Note> {
    const note = await this.findById(id);
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }

    return this.update(id, { completed: !note.completed });
  }

  async archiveNote(id: string): Promise<Note> {
    return this.update(id, { archived: true });
  }

  async unarchiveNote(id: string): Promise<Note> {
    return this.update(id, { archived: false });
  }

  async getNotesStats(): Promise<{ total: number; completed: number; pending: number; archived: number }> {
    const notes = await this.loadFromStorage();
    
    return {
      total: notes.length,
      completed: notes.filter(n => n.completed && !n.archived).length,
      pending: notes.filter(n => !n.completed && !n.archived).length,
      archived: notes.filter(n => n.archived).length,
    };
  }

  async clearCache(): Promise<void> {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}