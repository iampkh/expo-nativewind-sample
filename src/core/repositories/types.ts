import { BaseEntity } from '../../store/types';

// Base repository interface for CRUD operations
export interface BaseRepository<T extends BaseEntity> {
  // Read operations
  findAll(params?: FindAllParams): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(criteria: Partial<T>): Promise<T | null>;
  
  // Write operations
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T>;
  delete(id: string): Promise<boolean>;
  
  // Batch operations
  createMany(data: Omit<T, keyof BaseEntity>[]): Promise<T[]>;
  updateMany(criteria: Partial<T>, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T[]>;
  deleteMany(ids: string[]): Promise<boolean>;
}

export interface FindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface RepositoryConfig {
  cacheEnabled?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  offlineSupport?: boolean;
}