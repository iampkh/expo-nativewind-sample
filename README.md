# Expo NativeWind Sample - Modular Architecture 🚀

A production-ready Expo React Native application showcasing clean modular architecture, WatermelonDB integration, and scalable development patterns for enterprise applications.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🗄️ Database (WatermelonDB)](#️-database-watermelondb)
- [🧩 Module System](#-module-system)
- [🔧 Development Guide](#-development-guide)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)

## 🎯 Project Overview

This project demonstrates a **scalable, modular React Native application** built with:

- **🏗️ Clean Architecture**: Separation of concerns with distinct layers
- **🧩 Modular Design**: Feature-based modules for scalability
- **🗄️ WatermelonDB**: High-performance SQLite database with offline support
- **⚡ Expo SDK**: Latest Expo tools and development workflow
- **🎨 NativeWind**: Tailwind CSS for React Native
- **🔄 Redux Toolkit**: State management with modern patterns
- **📱 Cross-platform**: iOS, Android, and Web support

### Key Features

✅ **Modular Architecture** - Easy to scale with new features  
✅ **Clean Code Patterns** - Repository pattern, Use Cases, Interactors  
✅ **Database Integration** - WatermelonDB with multi-database support  
✅ **State Management** - Redux Toolkit with feature-specific slices  
✅ **Type Safety** - Full TypeScript support throughout  
✅ **Testing Ready** - Structured for unit and integration tests  
✅ **Developer Experience** - Hot reload, debugging, and development tools  

## 🏗️ Architecture Overview

This application follows **Clean Architecture** principles with a **modular, feature-based** structure:

```
┌─────────────────────────────────────────────────────────┐
│                    App Layer                            │
│                 (Expo Router)                           │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 Presentation Layer                      │
│              (React Components)                         │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                Application Layer                        │
│            (UseCases & Interactors)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Domain Layer                           │
│              (Repositories & Services)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               Infrastructure Layer                      │
│            (Database, Storage, Network)                 │
└─────────────────────────────────────────────────────────┘
```

### Architecture Layers

1. **App Layer** (`app/`): Expo Router file-based routing
2. **Presentation Layer** (`src/shared/components`, `src/modules/*/components`): React components and UI
3. **Application Layer** (`src/modules/*/useCases`, `src/core/useCases`): Business logic coordination
4. **Domain Layer** (`src/modules/*/repositories`, `src/core/repositories`): Data access abstractions
5. **Infrastructure Layer** (`src/core/storage`, `src/core/services`): External systems and data sources

## 📁 Project Structure

```
expo-nativewind-sample/
├── 📱 app/                          # Expo Router (File-based routing)
│   ├── _layout.tsx                  # Root layout with providers
│   ├── index.tsx                    # Home screen
│   ├── ListExample.tsx              # Todo list example
│   └── +not-found.tsx               # 404 page
│
├── 🧩 src/                          # Source code
│   ├── 🏗️ core/                     # Core infrastructure
│   │   ├── base/                    # Base classes and utilities
│   │   ├── storage/                 # Database and storage layer
│   │   │   ├── database.ts          # WatermelonDB configuration
│   │   │   ├── database/            # Database implementations
│   │   │   │   ├── testdb/          # Test database
│   │   │   │   ├── models/          # Core database models
│   │   │   │   └── userdb/          # User database
│   │   │   └── cache/               # Local caching (AsyncStorage)
│   │   ├── repositories/            # Data access layer
│   │   ├── useCases/                # Business logic layer
│   │   ├── services/                # Core services
│   │   ├── interfaces/              # Core interfaces
│   │   ├── remoteDataStores/        # Remote data handling
│   │   └── network/                 # API clients (future)
│   │
│   ├── 🧩 modules/                  # Feature modules
│   │   ├── auth/                    # Authentication module
│   │   │   ├── components/          # Auth-specific components
│   │   │   ├── hooks/               # Auth hooks
│   │   │   ├── repositories/        # Auth data access
│   │   │   ├── useCases/            # Auth business logic
│   │   │   ├── interactors/         # Auth application logic
│   │   │   ├── store/               # Auth state management
│   │   │   ├── types/               # Auth TypeScript types
│   │   │   └── services/            # Auth services
│   │   │
│   │   └── todo/                    # Todo module (example)
│   │       ├── components/          # Todo-specific components
│   │       │   └── TodoVariant.tsx  # Todo list item variant
│   │       ├── repositories/        # Todo data access
│   │       ├── useCases/            # Todo business logic
│   │       ├── interactors/         # Todo application logic
│   │       ├── store/               # Todo state management
│   │       │   ├── simpleTodoSlice.ts
│   │       │   ├── simpleTodoThunk.ts
│   │       │   └── todoRegistry.ts
│   │       └── types/               # Todo TypeScript types
│   │
│   ├── 🔄 store/                    # Global Redux store
│   │   ├── index.ts                 # Store configuration
│   │   ├── slices/                  # Global slices
│   │   │   └── notesSlice.ts        # Notes state management
│   │   └── types.ts                 # Store types
│   │
│   └── 🌐 shared/                   # Shared utilities and components
│       ├── components/              # Reusable UI components
│       │   ├── themed/              # Themed components
│       │   ├── list/                # List components
│       │   └── ui/                  # Base UI components
│       ├── hooks/                   # Shared React hooks
│       ├── utils/                   # Utility functions
│       ├── constants/               # Global constants
│       ├── types/                   # Shared TypeScript types
│       ├── themes/                  # Theme configuration
│       └── providers/               # Global providers
│
├── 📚 Documentation
│   ├── README.md                    # This file
│   ├── ARCHITECTURE.md              # Detailed architecture guide
│   └── src/core/storage/README.md   # Storage architecture
│
└── 📋 Configuration
    ├── package.json                 # Dependencies and scripts
    ├── expo.json                    # Expo configuration
    ├── tsconfig.json                # TypeScript configuration
    ├── tailwind.config.js           # Tailwind CSS configuration
    └── babel.config.js              # Babel configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- For mobile development:
  - iOS: Xcode and iOS Simulator
  - Android: Android Studio and Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expo-nativewind-sample
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on platform**
   ```bash
   # iOS Simulator
   npx expo run:ios
   
   # Android Emulator
   npx expo run:android
   
   # Web browser
   npx expo start --web
   ```

### Development Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run web           # Run on Web

# Build & Deploy
npm run build         # Build for production
npm run preview       # Preview production build

# Code Quality
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript compiler
npm run test          # Run tests (when added)

# Database
npm run db:reset      # Reset database (custom script)
npm run db:seed       # Seed test data (custom script)
```

## 🗄️ Database (WatermelonDB)

This project uses **WatermelonDB**, a high-performance reactive database for React Native apps built on top of SQLite.

### Why WatermelonDB?

- **🚀 Performance**: Optimized for complex apps with large datasets
- **⚛️ Reactive**: Automatic UI updates when data changes
- **💾 Offline-first**: Works seamlessly offline with sync capabilities
- **📱 Cross-platform**: Same API on iOS, Android, and Web
- **🔗 Relations**: Powerful relational database features

### Database Architecture

```
WatermelonDB Architecture
├── 🗄️ Database (database.ts)
│   ├── 📊 Schema (schema.ts)
│   └── 📋 Models
│       ├── TestUser (testdb/)
│       ├── Todo (models/Todo.ts)
│       ├── TodoModel (models/TodoModel.ts)
│       └── UserProfile (userdb/)
│
├── 💾 Storage Layer
│   ├── TodoStorage.ts (CRUD operations)
│   └── LocalCache.ts (AsyncStorage wrapper)
│
└── 🔄 Sync Strategy (future)
    ├── Background sync
    ├── Conflict resolution
    └── Multi-device support
```

### Database Usage Examples

#### Basic Operations

```typescript
import { TodoStorage, Todo, TodoStatus } from '@/src/core/storage';

// Create a new todo
const newTodo = await TodoStorage.getInstance().createTodo({
  title: 'Learn WatermelonDB',
  description: 'Understand reactive database patterns',
  date: '2024-01-01',
  status: TodoStatus.open
});

// Get all todos
const todos = await TodoStorage.getInstance().getAllTodos();

// Update a todo
await TodoStorage.getInstance().updateTodo(todoId, {
  status: TodoStatus.completed
});

// Delete a todo
await TodoStorage.getInstance().deleteTodo(todoId);
```

#### Reactive Queries (with React components)

```typescript
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { TodoModel } from '@/src/core/storage';

function TodoList() {
  const database = useDatabase();
  const todos = useDatabase(
    () => database.get<TodoModel>('todos').query(),
    []
  );

  return (
    <View>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </View>
  );
}
```

#### Testing Database

The project includes a comprehensive database test:

```bash
# The test runs automatically on app startup
# Check logs for: "🎉 [WatermelonDB] Database test completed successfully!"
```

### Adding New Database Models

1. **Create the WatermelonDB Model**
   ```typescript
   // src/core/storage/database/models/NewModel.ts
   import { Model } from '@nozbe/watermelondb';
   import { field, text } from '@nozbe/watermelondb/decorators';

   export default class NewModel extends Model {
     static table = 'new_table';
     
     @text('name') name!: string;
     @field('is_active') isActive!: boolean;
   }
   ```

2. **Add to Schema**
   ```typescript
   // src/core/storage/schema.ts
   export default appSchema({
     version: 2, // Increment version
     tables: [
       // existing tables...
       tableSchema({
         name: 'new_table',
         columns: [
           { name: 'name', type: 'string' },
           { name: 'is_active', type: 'boolean' }
         ]
       })
     ]
   });
   ```

3. **Register in Database**
   ```typescript
   // src/core/storage/database.ts
   import NewModel from './database/models/NewModel';
   
   export const database = new Database({
     adapter,
     modelClasses: [TestUser, TodoModel, NewModel], // Add here
   });
   ```

## 🧩 Module System

The application uses a **feature-based modular architecture** where each feature is a self-contained module with its own components, business logic, data access, and state management.

### Module Structure

Each module follows this consistent structure:

```
src/modules/[moduleName]/
├── components/          # UI components specific to this feature
├── hooks/              # Feature-specific React hooks
├── repositories/       # Data access layer for this feature
├── useCases/           # Business logic (Use Case pattern)
├── interactors/        # Application logic coordination
├── store/              # Redux slices and thunks
├── types/              # TypeScript types for this feature
├── services/           # Feature-specific services
└── index.ts            # Module exports
```

### Creating a New Module

Let's create a `chat` module as an example:

#### Step 1: Create Module Structure

```bash
mkdir -p src/modules/chat/{components,hooks,repositories,useCases,interactors,store,types,services}
```

#### Step 2: Create Module Components

```typescript
// src/modules/chat/components/ChatView.tsx
import React from 'react';
import { View, Text } from 'react-native';

export function ChatView() {
  return (
    <View>
      <Text>Chat Feature</Text>
    </View>
  );
}
```

#### Step 3: Create Repository

```typescript
// src/modules/chat/repositories/ChatRepository.ts
import { AbstractBaseRepository } from '@/src/core/repositories/BaseRepository';
import { ChatMessage } from '../types/chat.types';

export class ChatRepository extends AbstractBaseRepository {
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    // Implementation here
    return [];
  }
  
  async sendMessage(message: ChatMessage): Promise<void> {
    // Implementation here
  }
}
```

#### Step 4: Create Use Case

```typescript
// src/modules/chat/useCases/ChatUseCase.ts
import { AbstractBaseUseCase } from '@/src/core/useCases/BaseUseCase';
import { UseCaseContext } from '@/src/core/useCases/types';
import { ChatRepository } from '../repositories/ChatRepository';

export class ChatUseCase extends AbstractBaseUseCase {
  constructor(
    context: UseCaseContext,
    private chatRepository: ChatRepository
  ) {
    super(context);
  }

  async loadChatMessages(chatId: string) {
    const messages = await this.chatRepository.getChatMessages(chatId);
    // Dispatch to store, handle errors, etc.
    return messages;
  }
}
```

#### Step 5: Create Redux Store

```typescript
// src/modules/chat/store/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../types/chat.types';

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    // other reducers...
  },
});

export const { setMessages } = chatSlice.actions;
export default chatSlice.reducer;
```

#### Step 6: Create Module Index

```typescript
// src/modules/chat/index.ts
export * from './components/ChatView';
export * from './repositories/ChatRepository';
export * from './useCases/ChatUseCase';
export * from './store/chatSlice';
export * from './types/chat.types';
```

#### Step 7: Register in Global Store

```typescript
// src/store/index.ts
import chatSlice from '../modules/chat/store/chatSlice';

export const store = configureStore({
  reducer: {
    notes: notesSlice,
    simpleTodo: simpleTodoSlice,
    chat: chatSlice, // Add new module
  },
  // ... middleware
});
```

#### Step 8: Update Main Module Index

```typescript
// src/modules/index.ts
export * from './todo';
export * from './auth';
export * from './chat'; // Add new module export
```

### Module Communication

Modules communicate through:

1. **Shared State**: Redux store for global state
2. **Shared Services**: Core services in `src/core/services`
3. **Shared Components**: Reusable components in `src/shared/components`
4. **Events**: Custom event system (if needed)

### Module Best Practices

- **🎯 Single Responsibility**: Each module handles one feature domain
- **🔒 Encapsulation**: Keep internal logic private, expose through index.ts
- **📦 Self-contained**: Module should work independently
- **🔗 Loose Coupling**: Minimize dependencies between modules
- **📋 Consistent Structure**: Follow the same pattern for all modules
- **🧪 Testable**: Structure enables easy unit and integration testing

## 🔧 Development Guide

### Code Organization Principles

1. **Feature-first Organization**: Group by feature, not by file type
2. **Clean Architecture**: Separate presentation, business logic, and data access
3. **Dependency Inversion**: High-level modules don't depend on low-level modules
4. **Single Responsibility**: Each class/function has one reason to change
5. **Interface Segregation**: Clients shouldn't depend on interfaces they don't use

### Import Guidelines

```typescript
// ✅ Good: Import from module index
import { TodoUseCase, TodoRepository } from '@/src/modules/todo';

// ✅ Good: Import shared utilities
import { Button, Text } from '@/src/shared/components/themed';

// ✅ Good: Import core services
import { TodoStorage } from '@/src/core/storage';

// ❌ Bad: Import internal module files directly
import { TodoUseCase } from '@/src/modules/todo/useCases/TodoUseCase';

// ❌ Bad: Cross-module imports
import { AuthService } from '@/src/modules/auth/services/AuthService';
// Instead, put shared logic in core/ or shared/
```

### State Management Patterns

#### Module State (Redux Toolkit)

```typescript
// Feature-specific state in module store
const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // Synchronous actions
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Async thunk actions
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload;
    });
  },
});
```

#### Global State Coordination

```typescript
// Global state coordination in main store
export const store = configureStore({
  reducer: {
    // Module slices
    todo: todoSlice,
    auth: authSlice,
    chat: chatSlice,
    
    // Global slices
    app: appSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          // Inject dependencies
          todoRepository,
          authService,
        },
      },
    }),
});
```

### Error Handling Patterns

#### Repository Layer

```typescript
export class TodoRepository {
  async createTodo(data: CreateTodoData): Promise<DatabaseResult<Todo>> {
    try {
      const todo = await this.storage.create(data);
      return { success: true, data: todo };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
```

#### Use Case Layer

```typescript
export class TodoUseCase {
  async createTodo(data: CreateTodoData): Promise<UseCaseResult<Todo>> {
    const result = await this.todoRepository.createTodo(data);
    
    if (result.success) {
      // Dispatch success action
      this.dispatch(addTodo(result.data));
      return { success: true, data: result.data };
    }
    
    // Handle error
    this.dispatch(setError(result.error));
    return { success: false, error: result.error };
  }
}
```

### Testing Strategy

#### Unit Tests (Example structure)

```
src/modules/todo/__tests__/
├── repositories/
│   └── TodoRepository.test.ts
├── useCases/
│   └── TodoUseCase.test.ts
├── components/
│   └── TodoVariant.test.tsx
└── store/
    └── todoSlice.test.ts
```

#### Integration Tests

```typescript
// Integration test example
describe('Todo Module Integration', () => {
  it('should create todo and update UI', async () => {
    const { store } = setupTestStore();
    const todoUseCase = new TodoUseCase(context, todoRepository);
    
    await todoUseCase.createTodo({
      title: 'Test Todo',
      status: TodoStatus.open,
    });
    
    const state = store.getState();
    expect(state.todo.todos).toHaveLength(1);
  });
});
```

## 📚 Documentation

### Available Documentation

- **[README.md](./README.md)**: This comprehensive guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Detailed architecture patterns and principles
- **[Core Storage README](./src/core/storage/README.md)**: Database and storage architecture

### Code Documentation Standards

- **JSDoc Comments**: Document complex functions and classes
- **README per module**: Document module-specific patterns
- **Type Definitions**: Use descriptive TypeScript interfaces
- **Example Usage**: Include usage examples in documentation

### API Documentation (Future)

When adding API integration:

```typescript
// Document API endpoints
/**
 * Todo API Endpoints
 * 
 * GET    /api/todos          - Get all todos
 * POST   /api/todos          - Create new todo
 * PUT    /api/todos/:id      - Update todo
 * DELETE /api/todos/:id      - Delete todo
 * 
 * @see {@link TodoApiService} for implementation
 */
```

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-module-name
   ```

2. **Follow Module Structure**
   - Use the established module pattern
   - Follow import guidelines
   - Add appropriate TypeScript types

3. **Test Your Changes**
   ```bash
   npm run typecheck
   npm run lint
   npx expo run:android  # Test on Android
   npx expo run:ios      # Test on iOS
   ```

4. **Update Documentation**
   - Update README if adding new features
   - Document new modules appropriately
   - Add JSDoc comments for complex logic

5. **Submit Pull Request**
   - Clear description of changes
   - Follow commit message conventions
   - Include screenshots for UI changes

### Code Style Guidelines

- **TypeScript**: Use strict mode, prefer interfaces over types
- **Components**: Use functional components with hooks
- **Naming**: Use PascalCase for components, camelCase for functions
- **Files**: Use consistent naming (PascalCase for components, camelCase for utilities)
- **Imports**: Absolute imports for cross-module, relative for same module

### Performance Guidelines

- **Bundle Size**: Keep module sizes reasonable
- **Database Queries**: Use efficient WatermelonDB patterns
- **State Updates**: Minimize unnecessary re-renders
- **Image Loading**: Optimize image sizes and loading
- **Navigation**: Use lazy loading for routes when possible

---

## 🎉 Ready to Build?

This architecture provides a solid foundation for building scalable React Native applications. The modular structure allows your team to work independently on different features while maintaining code quality and consistency.

### Next Steps

1. **Explore the codebase**: Start with `app/index.tsx` and follow the imports
2. **Run the app**: See the Todo example in action
3. **Create your first module**: Follow the module creation guide
4. **Read the architecture docs**: Understand the patterns in depth
5. **Start building**: Add your feature modules and scale the application

### Need Help?

- Check the [Architecture Guide](./ARCHITECTURE.md) for detailed patterns
- Review the [Storage Documentation](./src/core/storage/README.md) for database usage
- Look at existing modules (`src/modules/todo/`) for examples
- Follow the established patterns and conventions

**Happy coding! 🚀**