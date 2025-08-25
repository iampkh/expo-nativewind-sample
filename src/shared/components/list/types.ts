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

// Base List Component Types - Documentation
/**
 * List Component - Similar to Android RecyclerView/ListView
 * 
 * A flexible list component that can display arrays of data with two main variants:
 * 1. SimpleList - Basic array display without grouping
 * 2. GroupedList - Groups items based on custom logic (lambda function)
 * 
 * Usage Examples:
 * 
 * Simple List:
 * <List
 *   variant="simple"
 *   data={users}
 *   renderItem={(user) => <UserCard user={user} />}
 *   showSeparator={true}
 * />
 * 
 * Grouped List:
 * <List
 *   variant="grouped"
 *   data={users}
 *   groupBy={(user) => user.department}
 *   renderItem={(user) => <UserCard user={user} />}
 *   renderGroupHeader={(dept, users) => <DeptHeader title={dept} count={users.length} />}
 * />
 */

/**
 * Base properties shared by all List variants
 * @template T - The type of items in your data array
 */
export interface BaseListProps<T> {
  /** 
   * Array of data items to display in the list
   * Example: [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }]
   */
  data: T[];
  
  /** 
   * Function to generate unique keys for each item (like React's key prop)
   * If not provided, will use array index as key
   * Example: (user) => user.id
   */
  keyExtractor?: (item: T, index: number) => string;
  
  /** 
   * Function that defines how each item should be rendered
   * This is where you return your custom component for each item
   * Example: (user, index) => <UserCard user={user} />
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  
  /** 
   * CSS classes for the main scroll container
   * Example: "flex-1 bg-gray-100"
   */
  className?: string;
  
  /** 
   * CSS classes for the content container inside the scroll view
   * Example: "bg-white rounded-lg shadow-sm"
   */
  contentContainerClassName?: string;
  
  /** 
   * Whether to show separator lines between items
   * Default: false
   */
  showSeparator?: boolean;
  
  /** 
   * CSS classes for the separator line
   * Default: "h-px bg-gray-200"
   */
  separatorClassName?: string;
}

/**
 * Props for Simple List variant
 * Use this when you want a basic list without any grouping
 * @template T - The type of items in your data array
 */
export interface SimpleListProps<T> extends BaseListProps<T> {
  /** Must be 'simple' to use this variant */
  variant: 'simple';
}

/**
 * Props for Grouped List variant
 * Use this when you want to group items based on some criteria
 * @template T - The type of items in your data array
 * @template K - The type of the group key (usually string, but can be number, etc.)
 */
export interface GroupedListProps<T, K = string> extends BaseListProps<T> {
  /** Must be 'grouped' to use this variant */
  variant: 'grouped';
  
  /** 
   * Lambda function that determines how to group items
   * This function is called for each item to determine which group it belongs to
   * Example: (user) => user.department  // Groups users by their department
   * Example: (product) => product.category  // Groups products by category
   */
  groupBy: (item: T) => K;
  
  /** 
   * Optional function to customize how group headers are rendered
   * If not provided, will show a default header with the group key
   * Example: (department, users) => <HeaderComponent title={department} count={users.length} />
   */
  renderGroupHeader?: (groupKey: K, items: T[]) => React.ReactNode;
  
  /** 
   * CSS classes for the default group header
   * Only used if renderGroupHeader is not provided
   * Default: "px-4 py-2 bg-gray-50"
   */
  groupHeaderClassName?: string;
}

/** Available variants for the List component */
export type ListComponentVariant = 'simple' | 'grouped';

/** 
 * Union type of all possible List props
 * TypeScript will automatically infer which props are required based on the variant
 */
export type ListProps<T, K = string> = SimpleListProps<T> | GroupedListProps<T, K>;

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