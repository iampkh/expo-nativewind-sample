import { DatabaseResult } from '../../../shared/types/database.types';
export interface IDatabaseRepository {
  saveData<T>(
    key: string,
    data: T,
    collection?: string
  ): Promise<DatabaseResult<T>>
  saveEncryptedData<T>(
    key: string,
    data: T,
    collection?: string
  ): Promise<DatabaseResult<T>>
  getData<T>(key: string, collection?: string): Promise<DatabaseResult<T>>
  getEncryptedData<T>(
    key: string,
    collection?: string
  ): Promise<DatabaseResult<T>>
  removeData(key: string, collection?: string): Promise<DatabaseResult<boolean>>
  syncData(collection: string): Promise<DatabaseResult<boolean>>
}
