import { TodoInteractor } from '../../interactors/TodoInteractor';
import { HttpRemoteDataStore } from '../../remoteDataStores/BaseRemoteDataStore';
import { BaseRemoteDataStore } from '../../remoteDataStores/types';
import { TodoRepository } from '../../repositories/TodoRepository';
import { SimpleTodoUseCase } from '../../useCases/SimpleTodoUseCase';
import { TodoScreenUseCase } from '../../useCases/TodoScreenUseCase';
import { UseCaseContext } from '../../useCases/types';

class TodoRegistry {
  private static instance: TodoRegistry;
  private _todoRepository: TodoRepository | null = null;
  private _todoInteractor: TodoInteractor | null = null;
  private _remoteDataStore: BaseRemoteDataStore | null = null;
  private _simpleTodoUseCase: SimpleTodoUseCase | null = null;
  private _todoScreenUseCase: TodoScreenUseCase | null = null;

  private constructor() {}

  public static getInstance(): TodoRegistry {
    if (!TodoRegistry.instance) {
      TodoRegistry.instance = new TodoRegistry();
    }
    return TodoRegistry.instance;
  }

  public getRemoteDataStore(): BaseRemoteDataStore {
    if (!this._remoteDataStore) {
      this._remoteDataStore = new HttpRemoteDataStore(
        process.env.API_BASE_URL || 'http://localhost:3000/api'
      );
    }
    return this._remoteDataStore;
  }

  public getTodoRepository(): TodoRepository {
    if (!this._todoRepository) {
      this._todoRepository = new TodoRepository(
        this.getRemoteDataStore(),
        {
          cacheEnabled: true,
          cacheTTL: 5 * 60 * 1000, // 5 minutes
          offlineSupport: true,
        }
      );
    }
    return this._todoRepository;
  }

  public getTodoInteractor(): TodoInteractor {
    if (!this._todoInteractor) {
      this._todoInteractor = new TodoInteractor(this.getTodoRepository());
    }
    return this._todoInteractor;
  }

  public getSimpleTodoUseCase(): SimpleTodoUseCase {
    if (!this._simpleTodoUseCase) {
      // Create a mock context since we're not using Redux dispatch in this use case
      const context: UseCaseContext = {
        dispatch: (() => {}) as any,
        getState: () => ({} as any),
        repositories: {
          todoRepository: this.getTodoRepository()
        }
      };
      this._simpleTodoUseCase = new SimpleTodoUseCase(context, this.getTodoInteractor());
    }
    return this._simpleTodoUseCase;
  }

  public getTodoScreenUseCase(dispatch: any, getState: any): TodoScreenUseCase {
    if (!this._todoScreenUseCase) {
      const context: UseCaseContext = {
        dispatch,
        getState,
        repositories: {
          todoRepository: this.getTodoRepository()
        }
      };
      this._todoScreenUseCase = new TodoScreenUseCase(context, this.getTodoInteractor());
    }
    return this._todoScreenUseCase;
  }

  public reset(): void {
    this._todoRepository = null;
    this._todoInteractor = null;
    this._remoteDataStore = null;
    this._simpleTodoUseCase = null;
    this._todoScreenUseCase = null;
  }
}

export const todoRegistry = TodoRegistry.getInstance();

export default todoRegistry;