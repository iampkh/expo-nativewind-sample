import { AbstractScreenUseCase } from '../BaseScreenUseCase';
import { UseCaseContext, UseCaseResult } from '../types';
import { 
  fetchNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  toggleNoteComplete,
  setFilter,
  setSelectedView,
  selectNote,
  deselectNote,
  toggleSelectNote,
  selectAllNotesAction,
  deselectAllNotes,
  deleteMultipleNotes,
  archiveNote,
  unarchiveNote
} from '../../store/slices/notesSlice';
import { CreateNoteData, UpdateNoteData, NotesFilter } from '../../types/notes';

export class NotesScreenUseCase extends AbstractScreenUseCase {
  constructor(context: UseCaseContext) {
    super(context);
  }

  async execute(action: string, ...args: any[]): Promise<any> {
    switch (action) {
      case 'loadNotes':
        return this.loadNotes(args[0]);
      case 'createNote':
        return this.createNote(args[0]);
      case 'updateNote':
        return this.updateNote(args[0], args[1]);
      case 'deleteNote':
        return this.deleteNote(args[0]);
      case 'toggleComplete':
        return this.toggleComplete(args[0]);
      case 'setFilter':
        return this.setFilter(args[0]);
      case 'setView':
        return this.setView(args[0]);
      case 'selectNote':
        return this.selectNote(args[0]);
      case 'toggleSelectNote':
        return this.toggleSelectNote(args[0]);
      case 'selectAllNotes':
        return this.selectAllNotes();
      case 'deselectAllNotes':
        return this.deselectAllNotes();
      case 'deleteSelectedNotes':
        return this.deleteSelectedNotes();
      case 'archiveNote':
        return this.archiveNote(args[0]);
      case 'unarchiveNote':
        return this.unarchiveNote(args[0]);
      case 'searchNotes':
        return this.searchNotes(args[0]);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  protected async onInitialize(): Promise<void> {
    console.log('Notes screen initializing...');
    // Load initial notes
    await this.loadNotes();
  }

  protected async onCleanup(): Promise<void> {
    console.log('Notes screen cleaning up...');
    // Clear any subscriptions or timers
    this.dispatch(deselectAllNotes());
  }

  protected async onScreenFocus(): Promise<void> {
    console.log('Notes screen focused');
    // Refresh notes when screen comes into focus
    await this.loadNotes();
  }

  protected async onScreenBlur(): Promise<void> {
    console.log('Notes screen blurred');
    // Clear selection when leaving screen
    this.dispatch(deselectAllNotes());
  }

  // Notes operations
  private async loadNotes(params?: { refresh?: boolean }): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      const state = this.getState();
      const filter = state.notes.filter;
      
      await this.dispatch(fetchNotes({ 
        filters: filter,
        limit: 50,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      })).unwrap();
      
      console.log('Notes loaded successfully');
    }, 'Failed to load notes');
  }

  private async createNote(data: CreateNoteData): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(createNote(data)).unwrap();
      console.log('Note created successfully');
    }, 'Failed to create note');
  }

  private async updateNote(id: string, data: UpdateNoteData): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(updateNote({ id, data })).unwrap();
      console.log('Note updated successfully');
    }, 'Failed to update note');
  }

  private async deleteNote(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(deleteNote(id)).unwrap();
      console.log('Note deleted successfully');
    }, 'Failed to delete note');
  }

  private async toggleComplete(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(toggleNoteComplete(id)).unwrap();
      console.log('Note completion toggled');
    }, 'Failed to toggle note completion');
  }

  private async archiveNote(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(archiveNote(id)).unwrap();
      console.log('Note archived successfully');
    }, 'Failed to archive note');
  }

  private async unarchiveNote(id: string): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      await this.dispatch(unarchiveNote(id)).unwrap();
      console.log('Note unarchived successfully');
    }, 'Failed to unarchive note');
  }

  // Filter and view operations
  private setFilter(filter: Partial<NotesFilter>): UseCaseResult<void> {
    try {
      this.dispatch(setFilter(filter));
      // Reload notes with new filter
      this.loadNotes();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private setView(view: 'all' | 'active' | 'completed' | 'archived'): UseCaseResult<void> {
    try {
      this.dispatch(setSelectedView(view));
      // This will automatically trigger a filter change and reload
      this.loadNotes();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private searchNotes(query: string): UseCaseResult<void> {
    try {
      this.dispatch(setFilter({ search: query }));
      this.loadNotes();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Selection operations
  private selectNote(id: string): UseCaseResult<void> {
    try {
      this.dispatch(selectNote(id));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private toggleSelectNote(id: string): UseCaseResult<void> {
    try {
      this.dispatch(toggleSelectNote(id));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private selectAllNotes(): UseCaseResult<void> {
    try {
      this.dispatch(selectAllNotesAction());
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private deselectAllNotes(): UseCaseResult<void> {
    try {
      this.dispatch(deselectAllNotes());
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async deleteSelectedNotes(): Promise<UseCaseResult<void>> {
    return this.executeWithState(async () => {
      const state = this.getState();
      const selectedIds = state.notes.selectedItems;
      
      if (selectedIds.length === 0) {
        throw new Error('No notes selected');
      }

      await this.dispatch(deleteMultipleNotes(selectedIds)).unwrap();
      console.log(`${selectedIds.length} notes deleted successfully`);
    }, 'Failed to delete selected notes');
  }

  // Utility methods
  getSelectedNotesCount(): number {
    const state = this.getState();
    return state.notes.selectedItems.length;
  }

  isNoteSelected(id: string): boolean {
    const state = this.getState();
    return state.notes.selectedItems.includes(id);
  }

  getCurrentFilter(): NotesFilter {
    const state = this.getState();
    return state.notes.filter;
  }

  getCurrentView(): 'all' | 'active' | 'completed' | 'archived' {
    const state = this.getState();
    return state.notes.selectedView;
  }

  getNotesStats() {
    const state = this.getState();
    const notes = state.notes.items;
    
    return {
      total: notes.length,
      completed: notes.filter(n => n.completed && !n.archived).length,
      pending: notes.filter(n => !n.completed && !n.archived).length,
      archived: notes.filter(n => n.archived).length,
      selected: state.notes.selectedItems.length,
    };
  }
}