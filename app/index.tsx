import React, { useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Text, View, Button } from '@/src/components/themed';
import { ListItem } from '@/src/components/list';
import { useTheme } from '@/src/hooks/useTheme';
import { useAppSelector } from '@/src/store';
import { selectAllNotes, selectNotesLoading, selectNotesError, selectSelectedView, selectNotesStats } from '@/src/store/slices/notesSlice';
import { NotesScreenUseCase } from '@/src/useCases/screens/NotesScreenUseCase';
import { useScreenUseCase } from '@/src/providers/UseCaseProvider';

export default function NotesScreen() {
  const { currentTheme, setTheme } = useTheme();
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  // Redux state
  const notes = useAppSelector(selectAllNotes);
  const loading = useAppSelector(selectNotesLoading);
  const error = useAppSelector(selectNotesError);
  const currentView = useAppSelector(selectSelectedView);
  const stats = useAppSelector(selectNotesStats);

  // Use case
  const notesUseCase = useScreenUseCase(
    (context) => new NotesScreenUseCase(context)
  );

  const toggleDarkLight = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for the note');
      return;
    }

    const result = await notesUseCase.execute('createNote', {
      title: newNoteTitle.trim(),
      content: '',
      priority: 'medium',
    });

    if (result.success) {
      setNewNoteTitle('');
      setShowAddNote(false);
    } else {
      Alert.alert('Error', result.error || 'Failed to create note');
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => notesUseCase.execute('deleteNote', id)
        }
      ]
    );
  };

  const handleToggleComplete = (id: string) => {
    notesUseCase.execute('toggleComplete', id);
  };

  const handleViewChange = (view: 'all' | 'active' | 'completed' | 'archived') => {
    notesUseCase.execute('setView', view);
  };

  const ViewButton = ({ 
    view, 
    label, 
    count 
  }: { 
    view: 'all' | 'active' | 'completed' | 'archived'; 
    label: string; 
    count: number;
  }) => (
    <Button
      title={`${label} (${count})`}
      variant={currentView === view ? 'primary' : 'outline'}
      size="sm"
      onPress={() => handleViewChange(view)}
    />
  );

  return (
    <ScrollView className="flex-1">
      <View padding="lg" className="gap-4">
        {/* Header with theme toggle */}
        <View className="flex-row items-center justify-between mb-4">
          <Text variant="brand" size="3xl" weight="bold">
            My Notes
          </Text>
          
          <View className="flex-row gap-2">
            <Button
              title="List Examples"
              onPress={() => router.push('/ListExample')}
              variant="secondary"
              size="sm"
            />
            <Button
              title={currentTheme === 'dark' ? '☀️' : '🌙'}
              onPress={toggleDarkLight}
              variant="outline"
              size="sm"
            />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-4">
          <Text variant="secondary" size="sm">
            Total: {stats.total} • Pending: {stats.pending} • Done: {stats.completed}
          </Text>
        </View>

        {/* View filters */}
        <View className="flex-row gap-2 mb-4">
          <ViewButton view="all" label="All" count={stats.total} />
          <ViewButton view="active" label="Active" count={stats.pending} />
          <ViewButton view="completed" label="Done" count={stats.completed} />
          <ViewButton view="archived" label="Archived" count={stats.archived} />
        </View>

        {/* Add note section */}
        <View variant="card" padding="md" borderRadius="lg" className="border border-gray-200 dark:border-gray-600 mb-4">
          {!showAddNote ? (
            <Button
              title="+ Add New Note"
              variant="primary"
              onPress={() => setShowAddNote(true)}
            />
          ) : (
            <View className="gap-3">
              <TextInput
                value={newNoteTitle}
                onChangeText={setNewNoteTitle}
                placeholder="Enter note title..."
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                autoFocus
              />
              <View className="flex-row gap-2">
                <Button
                  title="Create"
                  variant="primary"
                  size="sm"
                  onPress={handleCreateNote}
                  className="flex-1"
                />
                <Button
                  title="Cancel"
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    setShowAddNote(false);
                    setNewNoteTitle('');
                  }}
                  className="flex-1"
                />
              </View>
            </View>
          )}
        </View>

        {/* Loading state */}
        {loading && (
          <View className="py-8 items-center">
            <Text variant="secondary">Loading notes...</Text>
          </View>
        )}

        {/* Error state */}
        {error && (
          <View variant="card" padding="md" borderRadius="lg" className="border border-red-200 bg-red-50 dark:bg-red-900/20 mb-4">
            <Text className="text-red-600 dark:text-red-400">{error}</Text>
          </View>
        )}

        {/* Notes list */}
        {!loading && notes.length === 0 ? (
          <View className="py-12 items-center">
            <Text variant="secondary" size="lg" className="text-center">
              {currentView === 'all' ? 'No notes yet' : `No ${currentView} notes`}
            </Text>
            <Text variant="tertiary" size="sm" className="text-center mt-2">
              {currentView === 'all' ? 'Create your first note above!' : 'Try a different view or create some notes'}
            </Text>
          </View>
        ) : (
          <View variant="card" padding="sm" borderRadius="lg" className="border border-gray-200 dark:border-gray-600">
            {notes.map((note, index) => (
              <View key={note.id}>
                <ListItem
                  variant="note"
                  id={note.id}
                  title={note.title}
                  subtitle={note.content || undefined}
                  completed={note.completed}
                  priority={note.priority}
                  tags={note.tags}
                  createdAt={note.createdAt}
                  updatedAt={note.updatedAt}
                  onPress={(id) => {
                    // TODO: Navigate to note detail screen
                    console.log('Note pressed:', id);
                  }}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteNote}
                />
                {index < notes.length - 1 && (
                  <View className="h-px bg-gray-200 dark:bg-gray-700 mx-4" />
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}