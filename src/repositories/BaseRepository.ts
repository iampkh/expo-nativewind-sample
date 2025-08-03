import { BaseRepository, FindAllParams, RepositoryConfig } from './types';
import { BaseEntity } from '../store/types';
import { BaseRemoteDataStore } from '../remoteDataStores/types';

export abstract class AbstractBaseRepository<T extends BaseEntity> implements BaseRepository<T> {
  protected remoteDataStore: BaseRemoteDataStore;
  protected config: RepositoryConfig;
  protected cache: Map<string, { data: T; timestamp: number }>;

  constructor(
    remoteDataStore: BaseRemoteDataStore,
    config: RepositoryConfig = {}
  ) {
    this.remoteDataStore = remoteDataStore;
    this.config = {
      cacheEnabled: false,
      cacheTTL: 5 * 60 * 1000, // 5 minutes default
      offlineSupport: false,
      ...config,
    };
    this.cache = new Map();
  }

  // Abstract methods that must be implemented by concrete repositories
  abstract getResourcePath(): string;
  abstract transformToEntity(data: any): T;
  abstract transformFromEntity(entity: Omit<T, keyof BaseEntity>): any;

  // Cache management
  private getCacheKey(id: string): string {
    return `${this.getResourcePath()}_${id}`;
  }

  private isValidCache(timestamp: number): boolean {
    if (!this.config.cacheEnabled) return false;
    return Date.now() - timestamp < (this.config.cacheTTL || 0);
  }

  private setCache(id: string, data: T): void {
    if (this.config.cacheEnabled) {
      this.cache.set(this.getCacheKey(id), {
        data,
        timestamp: Date.now(),
      });
    }
  }

  private getCache(id: string): T | null {
    if (!this.config.cacheEnabled) return null;
    
    const cached = this.cache.get(this.getCacheKey(id));
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }
    
    // Remove expired cache
    if (cached) {
      this.cache.delete(this.getCacheKey(id));
    }
    
    return null;
  }

  // CRUD Operations
  async findAll(params?: FindAllParams): Promise<T[]> {
    try {
      const response = await this.remoteDataStore.get<T[]>(
        this.getResourcePath(),
        { params }
      );
      
      return response.data.map(item => this.transformToEntity(item));
    } catch (error) {
      console.error(`Error fetching ${this.getResourcePath()}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      // Check cache first
      const cached = this.getCache(id);
      if (cached) {
        return cached;
      }

      const response = await this.remoteDataStore.get<T>(
        `${this.getResourcePath()}/${id}`
      );
      
      const entity = this.transformToEntity(response.data);
      this.setCache(id, entity);
      
      return entity;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      console.error(`Error fetching ${this.getResourcePath()} by id ${id}:`, error);
      throw error;
    }
  }

  async findOne(criteria: Partial<T>): Promise<T | null> {
    try {
      const response = await this.remoteDataStore.get<T[]>(
        this.getResourcePath(),
        { params: criteria }
      );
      
      const items = response.data.map(item => this.transformToEntity(item));
      return items.length > 0 ? items[0] : null;
    } catch (error) {
      console.error(`Error finding ${this.getResourcePath()} with criteria:`, error);
      throw error;
    }
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    try {
      const transformedData = this.transformFromEntity(data);
      const response = await this.remoteDataStore.post<T>(
        this.getResourcePath(),
        transformedData
      );
      
      const entity = this.transformToEntity(response.data);
      this.setCache(entity.id, entity);
      
      return entity;
    } catch (error) {
      console.error(`Error creating ${this.getResourcePath()}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T> {
    try {
      const transformedData = this.transformFromEntity(data as Omit<T, keyof BaseEntity>);
      const response = await this.remoteDataStore.patch<T>(
        `${this.getResourcePath()}/${id}`,
        transformedData
      );
      
      const entity = this.transformToEntity(response.data);
      this.setCache(id, entity);
      
      return entity;
    } catch (error) {
      console.error(`Error updating ${this.getResourcePath()} with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.remoteDataStore.delete(
        `${this.getResourcePath()}/${id}`
      );
      
      // Remove from cache
      this.cache.delete(this.getCacheKey(id));
      
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.getResourcePath()} with id ${id}:`, error);
      throw error;
    }
  }

  async createMany(data: Omit<T, keyof BaseEntity>[]): Promise<T[]> {
    try {
      const transformedData = data.map(item => this.transformFromEntity(item));
      const response = await this.remoteDataStore.post<T[]>(
        `${this.getResourcePath()}/batch`,
        { items: transformedData }
      );
      
      const entities = response.data.map(item => this.transformToEntity(item));
      
      // Cache all created entities
      entities.forEach(entity => this.setCache(entity.id, entity));
      
      return entities;
    } catch (error) {
      console.error(`Error creating multiple ${this.getResourcePath()}:`, error);
      throw error;
    }
  }

  async updateMany(criteria: Partial<T>, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T[]> {
    try {
      const transformedData = this.transformFromEntity(data as Omit<T, keyof BaseEntity>);
      const response = await this.remoteDataStore.patch<T[]>(
        `${this.getResourcePath()}/batch`,
        { criteria, data: transformedData }
      );
      
      const entities = response.data.map(item => this.transformToEntity(item));
      
      // Update cache for all entities
      entities.forEach(entity => this.setCache(entity.id, entity));
      
      return entities;
    } catch (error) {
      console.error(`Error updating multiple ${this.getResourcePath()}:`, error);
      throw error;
    }
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    try {
      await this.remoteDataStore.delete(
        `${this.getResourcePath()}/batch`,
        { params: { ids: ids.join(',') } }
      );
      
      // Remove from cache
      ids.forEach(id => this.cache.delete(this.getCacheKey(id)));
      
      return true;
    } catch (error) {
      console.error(`Error deleting multiple ${this.getResourcePath()}:`, error);
      throw error;
    }
  }
}