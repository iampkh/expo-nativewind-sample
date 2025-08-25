# Modular Architecture Guide

## Overview

This project uses a modular architecture designed to support multiple feature modules (login, todo, chat, ads, moneymanager, organization, template, etc.) while maintaining clean separation of concerns and scalability.

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

## Architecture Principles

### 1. Feature Modules
Each feature module is self-contained with its own:
- **Components**: UI components specific to the feature
- **Hooks**: Feature-specific React hooks  
- **Repositories**: Data access for the feature
- **UseCases**: Business logic for the feature
- **Interactors**: Application logic coordination
- **Store**: Redux slices and thunks for the feature
- **Types**: TypeScript types specific to the feature
- **Services**: Feature-specific services

### 2. Clean Architecture Layers
The architecture follows clean architecture principles:

```
Presentation Layer (Components) 
    ↓
Application Layer (Interactors/UseCases)
    ↓  
Domain Layer (Repositories/Services)
    ↓
Infrastructure Layer (Storage/RemoteDataStores)
```

### 3. Dependency Flow
- **Modules** can import from `shared` and `core`
- **Shared** can import from `core` but not from `modules`
- **Core** should not import from `modules` or `shared`
- **Store** coordinates global state across modules

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

## Migration Benefits

This modular structure provides:

✅ **Scalability**: Easy to add new feature modules without affecting existing code  
✅ **Maintainability**: Related code is co-located within modules  
✅ **Team Collaboration**: Teams can work on different modules independently  
✅ **Testing**: Easier to test modules in isolation  
✅ **Code Reuse**: Clear separation between shared and module-specific code  
✅ **Performance**: Enables code splitting and lazy loading by module  

## File Reference Changes

All file references have been updated to reflect the new structure. Key changes:
- Repository imports now reference `src/core/repositories`
- Component imports now reference `src/shared/components` 
- Module-specific files are organized under `src/modules/{moduleName}`
- Storage and database files moved to `src/core/storage`

The `app/` folder remains unchanged and continues to serve as the Expo router entry point.