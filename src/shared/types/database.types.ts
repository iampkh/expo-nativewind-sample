// types/database.types.ts
export interface DatabaseConfig {
  encryptionKey?: string
  remoteEndpoint?: string
  sqliteDbPath?: string
}

export interface DatabaseResult<T> {
  success: boolean
  data?: T
  error?: string
}

export interface CacheStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}


export interface SqliteStorage {
  createTodo(todoData: any): Promise<DatabaseResult<any>>
  getTodo(id: string): Promise<DatabaseResult<any>>
  updateTodo(id: string, updates: any): Promise<DatabaseResult<any>>
  deleteTodo(id: string): Promise<DatabaseResult<boolean>>
  getAllTodos(): Promise<DatabaseResult<any[]>>
  getTodosByStatus(status: any): Promise<DatabaseResult<any[]>>
  getTodosByDate(date: string): Promise<DatabaseResult<any[]>>
  markAsCompleted(id: string): Promise<DatabaseResult<any>>
  markAsStarted(id: string): Promise<DatabaseResult<any>>
  markAsOpen(id: string): Promise<DatabaseResult<any>>
  disconnect(): Promise<void>
}

export interface RemoteStorage {
  sync(collection: string, data: any): Promise<any>
  fetch(collection: string, query?: any): Promise<any[]>
  update(collection: string, id: string, data: any): Promise<any>
  delete(collection: string, id: string): Promise<void>
}
