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

export interface SQLiteStorage {
  query(sql: string, params?: any[]): Promise<any[]>
  execute(sql: string, params?: any[]): Promise<void>
}

export interface RemoteStorage {
  sync(collection: string, data: any): Promise<any>
  fetch(collection: string, query?: any): Promise<any[]>
  update(collection: string, id: string, data: any): Promise<any>
  delete(collection: string, id: string): Promise<void>
}
