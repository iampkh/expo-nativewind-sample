import { TouchableOpacityProps } from 'react-native';

export interface BaseListItemProps extends Omit<TouchableOpacityProps, 'onPress' | 'onLongPress'> {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  onPress?: (id: string) => void;
  onLongPress?: (id: string) => void;
}

export interface DefaultListItemProps extends BaseListItemProps {
  // Default variant specific props
}

export interface NoteListItemProps extends BaseListItemProps {
  createdAt?: string;
  updatedAt?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface TodoListItemProps extends BaseListItemProps {
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface ContactListItemProps extends BaseListItemProps {
  avatar?: string | number;
  email?: string;
  phone?: string;
  status?: 'online' | 'offline' | 'away';
}

export type ListVariant = 'default' | 'note' | 'todo' | 'contact';

export interface ListItemProps extends BaseListItemProps {
  variant?: ListVariant;
  // Variant-specific props
  avatar?: string | number;
  email?: string;
  phone?: string;
  status?: 'online' | 'offline' | 'away';
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}