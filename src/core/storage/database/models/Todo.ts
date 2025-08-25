export enum TodoStatus {
  open = 'open',
  started = 'started',
  completed = 'completed'
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}