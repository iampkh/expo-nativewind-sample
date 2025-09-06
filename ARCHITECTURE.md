# Clean Modular Architecture Guide

## Overview

This project implements a **production-ready modular architecture** following **Clean Architecture** principles, designed to support multiple feature modules while maintaining clean separation of concerns, scalability, and maintainability. The architecture is built to handle enterprise-level React Native applications with complex business requirements.

## Architecture Philosophy

The architecture is based on these core principles:

- **🧩 Modular Design**: Features are organized as independent modules
- **🏗️ Clean Architecture**: Clear separation between layers with dependency inversion
- **📱 Cross-Platform**: Built for iOS, Android, and Web with shared business logic
- **🗄️ Database-First**: WatermelonDB integration with offline-first capabilities
- **🔄 Reactive State**: Redux Toolkit with reactive patterns
- **🧪 Test-Driven**: Structure enables comprehensive testing strategies
- **👥 Team-Scalable**: Multiple teams can work independently on different modules

## Directory Structure

```
src/
├── modules/                    # Feature modules
│   ├── auth/                  # Authentication module
│   ├── todo/                  # Todo management module  
│   ├── chat/                  # Chat module (future)
│   ├── ads/                   # Ads module (future)
│   ├── moneymanager/         # Money manager module (future)
│   ├── organization/         # Organization module (future)
│   └── template/             # Template module (future)
├── shared/                    # Shared utilities and components
│   ├── components/           # Reusable UI components
│   ├── hooks/               # Shared React hooks
│   ├── utils/               # Utility functions
│   ├── constants/           # Global constants
│   ├── types/               # Shared TypeScript types
│   ├── themes/              # Theme configuration
│   └── providers/           # Global providers
├── core/                     # Core infrastructure
│   ├── storage/             # Database and storage layer
│   ├── network/             # API clients (future)
│   ├── services/            # Core services
│   ├── repositories/        # Data access layer
│   ├── useCases/            # Business logic layer
│   ├── interactors/         # Application logic layer
│   ├── interfaces/          # Core interfaces
│   └── remoteDataStores/    # Remote data handling
└── store/                    # Global Redux store
```

## Clean Architecture Implementation

### Architecture Layers

This application implements Uncle Bob's Clean Architecture with the following layers:

```
┌─────────────────────────────────────────────────────────────┐
│                      App Layer                              │
│                   (Expo Router)                             │
│              File-based routing & navigation                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 Presentation Layer                          │
│               (React Components)                            │
│        UI Components, Screens, Navigation                  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                Application Layer                            │
│             (UseCases & Interactors)                        │
│          Business Logic Orchestration                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Domain Layer                              │
│            (Repositories & Services)                        │
│           Business Rules & Entity Logic                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Infrastructure Layer                           │
│         (Database, Storage, Network, External APIs)         │
│              External System Integrations                   │
└─────────────────────────────────────────────────────────────┘
```

### 1. App Layer (`app/`)
- **Responsibility**: Navigation and routing
- **Technology**: Expo Router with file-based routing
- **Contents**: Screen definitions, layouts, navigation configuration
- **Dependencies**: Can import from all other layers

### 2. Presentation Layer (`src/shared/components`, `src/modules/*/components`)
- **Responsibility**: User interface and user interaction
- **Technology**: React Native components, NativeWind styling
- **Contents**: Screens, components, UI logic
- **Dependencies**: Can import from Application and Domain layers

### 3. Application Layer (`src/modules/*/useCases`, `src/core/useCases`)
- **Responsibility**: Business logic orchestration and coordination
- **Technology**: Use Cases, Interactors, Redux Toolkit
- **Contents**: Business workflows, state management, application services
- **Dependencies**: Can import from Domain and Infrastructure layers

### 4. Domain Layer (`src/modules/*/repositories`, `src/core/repositories`)
- **Responsibility**: Business rules and entity definitions
- **Technology**: Repositories, Services, Domain Models
- **Contents**: Business entities, repository interfaces, domain services
- **Dependencies**: Can import from Infrastructure layer

### 5. Infrastructure Layer (`src/core/storage`, `src/core/services`)
- **Responsibility**: External system integrations
- **Technology**: WatermelonDB, HTTP clients, device APIs
- **Contents**: Database implementations, API clients, external service integrations
- **Dependencies**: Independent layer, minimal external dependencies

### Dependency Inversion Principle

```
High-level modules ────────┐
                           │ Should not depend on
                           ▼ low-level modules
Low-level modules ─────────┘

Both should depend on abstractions (interfaces)
```

**Implementation:**
- **Modules** can import from `shared` and `core`
- **Shared** can import from `core` but not from `modules`
- **Core** should not import from `modules` or `shared`
- **Store** coordinates global state across modules
- All dependencies point inward toward the domain

### Feature Module Architecture

Each feature module is self-contained with its own:

#### Module Components
- **components/**: UI components specific to the feature
- **hooks/**: Feature-specific React hooks  
- **repositories/**: Data access abstractions for the feature
- **useCases/**: Business logic orchestration (Use Case pattern)
- **interactors/**: Application logic coordination
- **store/**: Redux slices and thunks for state management
- **types/**: TypeScript types specific to the feature
- **services/**: Feature-specific domain services
- **index.ts**: Clean module interface and exports

#### Module Benefits
- **🔒 Encapsulation**: Internal implementation details are hidden
- **🧪 Testability**: Each layer can be tested independently
- **🔄 Replaceability**: Infrastructure can be swapped without affecting business logic
- **📦 Modularity**: Features can be developed, tested, and deployed independently
- **🚀 Scalability**: New features don't affect existing code

## Module Structure

### Example: Todo Module Structure
```
modules/todo/
├── components/
│   ├── TodoVariant.tsx
│   └── index.ts
├── hooks/
│   └── useTodo.ts
├── repositories/
│   ├── TodoRepository.ts
│   └── index.ts
├── useCases/
│   ├── SimpleTodoUseCase.ts
│   ├── TodoScreenUseCase.ts
│   └── index.ts
├── interactors/
│   ├── TodoInteractor.ts
│   └── index.ts
├── store/
│   ├── simpleTodoSlice.ts
│   ├── simpleTodoThunk.ts
│   ├── todoRegistry.ts
│   └── index.ts
├── types/
│   └── todo.types.ts
├── services/
│   └── TodoValidationService.ts
└── index.ts (exports everything)
```

## Adding New Modules

To add a new module (e.g., `chat`):

1. **Create the module structure**:
   ```bash
   mkdir -p src/modules/chat/{components,hooks,repositories,useCases,interactors,store,types,services}
   ```

2. **Create the module index file**:
   ```typescript
   // src/modules/chat/index.ts
   export * from './repositories/ChatRepository';
   export * from './useCases/ChatUseCase';
   export * from './interactors/ChatInteractor';
   export * from './store/chatSlice';
   export * from './components/ChatView';
   ```

3. **Update the main modules index**:
   ```typescript
   // src/modules/index.ts  
   export * from './todo';
   export * from './auth';
   export * from './chat'; // Add new module
   ```

4. **Register in store if needed**:
   ```typescript
   // src/store/index.ts
   import { chatSlice } from '../modules/chat/store/chatSlice';
   
   export const store = configureStore({
     reducer: {
       todos: todoSlice.reducer,
       chat: chatSlice.reducer, // Add new reducer
     },
   });
   ```

## Best Practices

### 1. Import Guidelines
- Use absolute imports from module root: `from 'src/modules/todo'`
- Keep relative imports within the same module
- Import from module index files, not internal files directly

### 2. Code Organization
- Keep module-specific code within the module
- Only put truly shared code in `shared/`
- Use `core/` for infrastructure that modules depend on
- Avoid circular dependencies between modules

### 3. State Management
- Module-specific state goes in the module's store
- Global state coordination happens in `store/`
- Use Redux Toolkit for consistency

### 4. Component Sharing
- Truly reusable components go in `shared/components`
- Feature-specific components stay in module
- Create variants for different use cases

## WatermelonDB Integration Architecture

### Database Architecture Strategy

WatermelonDB is integrated as part of the Infrastructure Layer, providing:

```
WatermelonDB Integration
├── 🏗️ Core Infrastructure (src/core/storage/)
│   ├── database.ts              # Main DB configuration
│   ├── schema.ts                # Unified schema
│   └── database/
│       ├── models/              # Core data models
│       ├── TodoStorage.ts       # CRUD operations
│       └── testdb/              # Development database
│
├── 📦 Module Integration
│   └── modules/todo/
│       ├── repositories/        # Abstract data access
│       ├── useCases/           # Business logic
│       └── store/              # State management
│
└── 🔄 Reactive Patterns
    ├── Real-time UI updates    # Automatic re-renders
    ├── Offline-first design    # Works without network
    └── Optimistic updates      # Immediate UI feedback
```

### Database Design Patterns

#### 1. Repository Pattern Implementation

```typescript
// Domain Layer - Abstract interface
interface TodoRepositoryInterface {
  createTodo(data: CreateTodoData): Promise<Todo>;
  getTodos(): Promise<Todo[]>;
}

// Infrastructure Layer - WatermelonDB implementation
class TodoRepository implements TodoRepositoryInterface {
  constructor(private storage: TodoStorage) {}
  
  async createTodo(data: CreateTodoData): Promise<Todo> {
    return this.storage.createTodo(data);
  }
}

// Application Layer - Use Case
class CreateTodoUseCase {
  constructor(private repo: TodoRepositoryInterface) {}
  
  async execute(data: CreateTodoData) {
    return this.repo.createTodo(data);
  }
}
```

#### 2. Reactive Query Pattern

```typescript
// React component with reactive database queries
function TodoList() {
  const database = useDatabase();
  const todos = useDatabase(
    () => database.get<TodoModel>('todos').query(),
    []
  );

  // UI automatically updates when database changes
  return todos.map(todo => <TodoItem key={todo.id} todo={todo} />);
}
```

#### 3. Optimistic Updates Pattern

```typescript
class TodoUseCase {
  async markCompleted(todoId: string) {
    // 1. Optimistic UI update
    this.dispatch(toggleTodoOptimistic(todoId));
    
    try {
      // 2. Update database
      await this.todoStorage.markCompleted(todoId);
      // 3. Database change triggers reactive update
    } catch (error) {
      // 4. Rollback optimistic update on failure
      this.dispatch(revertTodoOptimistic(todoId));
    }
  }
}
```

### Data Flow Architecture

```
User Interaction
    ↓
React Component (Presentation)
    ↓
Use Case (Application Logic)
    ↓
Repository (Domain Interface)
    ↓
Storage Service (Infrastructure)
    ↓
WatermelonDB (Database)
    ↓
Reactive Update ──→ Component Re-render
```

## State Management Architecture

### Redux Toolkit Integration

The application uses a hybrid state management approach:

#### 1. Global State (Redux Store)
```typescript
// Global application state
export const store = configureStore({
  reducer: {
    // Module-specific state
    todo: todoSlice,
    auth: authSlice,
    
    // Global application state
    notes: notesSlice,
    ui: uiSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          // Dependency injection
          todoRepository,
          authService,
          apiClient,
        },
      },
    }),
});
```

#### 2. Local Database State (WatermelonDB)
```typescript
// Reactive database queries for real-time data
const todos = useDatabase(
  () => database.get<TodoModel>('todos').query(),
  []
);
```

#### 3. Module State Coordination
```typescript
// Module thunks coordinate between Redux and Database
export const createTodo = createAsyncThunk(
  'todo/create',
  async (todoData, { extra: { todoRepository } }) => {
    const todo = await todoRepository.create(todoData);
    // Database change automatically triggers UI updates
    return todo;
  }
);
```

## Testing Architecture

### Testing Strategy by Layer

#### 1. Unit Tests
```
src/modules/todo/__tests__/
├── repositories/
│   └── TodoRepository.test.ts      # Repository interface tests
├── useCases/
│   └── CreateTodoUseCase.test.ts   # Business logic tests
├── components/
│   └── TodoVariant.test.tsx        # Component behavior tests
└── store/
    └── todoSlice.test.ts           # State management tests
```

#### 2. Integration Tests
```typescript
describe('Todo Module Integration', () => {
  it('should create todo and update UI', async () => {
    // Setup test environment with real database
    const testDB = await setupTestDatabase();
    const { store } = setupTestStore({ database: testDB });
    
    // Execute use case
    await store.dispatch(createTodo({ title: 'Test' }));
    
    // Verify database and state changes
    const dbTodos = await testDB.get('todos').query().fetch();
    const stateTodos = store.getState().todo.todos;
    
    expect(dbTodos).toHaveLength(1);
    expect(stateTodos).toHaveLength(1);
  });
});
```

#### 3. End-to-End Tests
```typescript
// Test complete user workflows
describe('Todo Workflow E2E', () => {
  it('should create, edit, and delete todo', async () => {
    await createTodo('Learn Architecture');
    await markTodoComplete('Learn Architecture');
    await deleteTodo('Learn Architecture');
  });
});
```

## Migration Benefits & Architecture Advantages

This modular clean architecture provides:

### Development Benefits
✅ **Scalability**: Easy to add new feature modules without affecting existing code  
✅ **Maintainability**: Related code is co-located within modules  
✅ **Team Collaboration**: Teams can work on different modules independently  
✅ **Testing**: Easier to test modules in isolation with clear dependencies  
✅ **Code Reuse**: Clear separation between shared and module-specific code  
✅ **Performance**: Enables code splitting and lazy loading by module  

### Technical Benefits
✅ **Clean Separation**: Each layer has a single responsibility  
✅ **Dependency Inversion**: High-level modules don't depend on low-level details  
✅ **Database Agnostic**: Business logic doesn't depend on specific database  
✅ **Offline-First**: WatermelonDB provides robust offline capabilities  
✅ **Type Safety**: Full TypeScript support throughout all layers  
✅ **Hot Reload**: Development experience optimized for rapid iteration  

### Business Benefits
✅ **Faster Development**: New features don't require understanding entire codebase  
✅ **Reduced Risk**: Changes to one module don't break other modules  
✅ **Quality Assurance**: Architecture enforces best practices and patterns  
✅ **Future-Proof**: Easy to migrate individual modules or underlying technologies  
✅ **Team Scaling**: New developers can focus on specific modules  
✅ **Code Reviews**: Smaller, focused changes are easier to review  

## File Reference Changes

All file references have been updated to reflect the clean architecture structure:

### Import Path Changes
- **Repository imports**: `src/core/repositories` and `src/modules/{module}/repositories`
- **Component imports**: `src/shared/components` and `src/modules/{module}/components`  
- **Module-specific files**: `src/modules/{moduleName}/*`
- **Storage and database**: `src/core/storage/*`
- **Shared utilities**: `src/shared/*`

### Architecture Boundaries
- **App layer** (`app/`): Expo Router entry points (unchanged)
- **Presentation layer**: Components are co-located with their respective modules
- **Application layer**: Use cases coordinate business workflows
- **Domain layer**: Repositories abstract data access
- **Infrastructure layer**: Core services and external integrations

This structure enables maintainable, testable, and scalable React Native applications that can grow from simple prototypes to enterprise-level applications.