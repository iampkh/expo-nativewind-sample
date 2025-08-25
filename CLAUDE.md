# Claude Context File - Expo + Expo-router + NativeWind + watermelondDb + Redux + Clean architecture + modular code maintenance

This context file provides comprehensive guidelines for maintaining the clean modular architecture and development patterns in this React Native project.

## 🏗️ Project Architecture Overview

### Core Architecture Pattern: Clean Modular Architecture
- **Framework**: Expo React Native with TypeScript
- **Architecture**: Clean Architecture with feature-based modules
- **Database**: WatermelonDB (reactive SQLite)
- **State Management**: Redux Toolkit with module-specific slices
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Routing**: Expo Router (file-based)

### Architecture Layers (Dependency Flow: Outer → Inner)
```
App Layer (app/)
    ↓
Presentation Layer (components)
    ↓
Application Layer (useCases, store)
    ↓
Domain Layer (repositories, services)
    ↓
Infrastructure Layer (storage, network)
```

## 📁 Modular Folder Structure

### Core Directory Structure
```
src/
├── core/                    # Infrastructure layer
│   ├── storage/            # WatermelonDB, database models, LocalCache
│   ├── repositories/       # Base repository patterns
│   ├── useCases/           # Core business logic
│   ├── services/           # Core services
│   ├── interfaces/         # Core interfaces
│   └── remoteDataStores/   # API clients
├── modules/                # Feature modules (self-contained)
│   └── [moduleName]/
│       ├── components/     # Module-specific UI components
│       ├── hooks/         # Module-specific React hooks
│       ├── repositories/  # Module data access
│       ├── useCases/      # Module business logic
│       ├── interactors/   # Application logic coordination
│       ├── store/         # Redux slices and thunks
│       ├── types/         # Module TypeScript types
│       ├── services/      # Module services
│       └── index.ts       # Module exports
├── shared/                # Shared utilities (presentation layer)
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Shared React hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # Global constants
│   ├── types/            # Shared TypeScript types
│   ├── themes/           # NativeWind theme configuration
│   └── providers/        # Global providers
└── store/                 # Global Redux store configuration
```

## 🎯 File Creation Guidelines

### When Creating ANY New File:

1. **ANALYZE**: Determine which layer and module the file belongs to
2. **LOCATION**: Place file in correct folder based on architecture
3. **DEPENDENCIES**: Follow dependency inversion principle
4. **IMPORTS**: Use proper import patterns
5. **PATTERNS**: Follow established patterns for the file type

### Module Creation Rules:
- **New feature** = New module in `src/modules/[featureName]/`
- **Shared utility** = Place in `src/shared/`
- **Database/Storage** = Place in `src/core/storage/`
- **Global state** = Place in `src/store/`

## 🧩 Module Development Patterns

### Creating a New Module (Required Structure):
```
src/modules/[moduleName]/
├── components/          # REQUIRED for UI features
├── store/              # REQUIRED: Redux slice + thunks
│   ├── [name]Slice.ts  # Redux Toolkit slice
│   ├── [name]Thunk.ts  # Async thunks
│   └── index.ts        # Store exports
├── repositories/       # REQUIRED for data access
├── useCases/          # REQUIRED for business logic
├── types/             # REQUIRED: TypeScript interfaces
├── hooks/             # Optional: Module-specific hooks
├── services/          # Optional: Module services
├── interactors/       # Optional: Complex coordination
└── index.ts           # REQUIRED: Module exports
```

### Module Naming Conventions:
- **Module names**: lowercase with hyphens (e.g., `user-profile`, `chat-messages`)
- **Files**: PascalCase for components, camelCase for utilities
- **Redux slices**: `[moduleName]Slice.ts`
- **Types**: `[moduleName].types.ts`

## 🔄 Redux State Management Rules

### Module State Management:
1. **ALWAYS** create module-specific Redux slice in `src/modules/[module]/store/`
2. **NEVER** put module state in global store directly
3. **Register** module slice in global store (`src/store/index.ts`)

### Redux Slice Template:
```typescript
// src/modules/[module]/store/[module]Slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface [Module]State {
  items: [Type][];
  loading: boolean;
  error: string | null;
}

const initialState: [Module]State = {
  items: [],
  loading: false,
  error: null,
};

const [module]Slice = createSlice({
  name: '[module]',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<[Type][]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setItems, setLoading, setError } = [module]Slice.actions;
export default [module]Slice.reducer;
```

### Global Store Registration:
```typescript
// src/store/index.ts - ALWAYS update when adding module
export const store = configureStore({
  reducer: {
    // Existing reducers...
    [moduleName]: [moduleName]Slice, // Add new module
  },
});
```

## 🗄️ Database (WatermelonDB) Patterns

### Database Rules:
1. **NEVER** access WatermelonDB directly from components
2. **ALWAYS** use Repository pattern
3. **NEVER** create multiple database instances
4. **USE** existing database instance from `src/core/storage/database.ts`

### Storage Access Pattern:
```typescript
// ✅ CORRECT: Use repository pattern
class TodoRepository {
  constructor(private storage: TodoStorage) {}
  
  async create(data: CreateTodoData): Promise<Todo> {
    return this.storage.createTodo(data);
  }
}

// ❌ WRONG: Direct database access from component
function Component() {
  const database = useDatabase(); // DON'T DO THIS
}
```

### Adding New Database Models:
1. **Model**: Create in `src/core/storage/database/models/`
2. **Schema**: Update `src/core/storage/schema.ts`
3. **Storage**: Create storage service if needed
4. **Repository**: Create in module's `repositories/` folder

## 💾 Local Storage Rules

### Local Cache (AsyncStorage) Rules:
1. **NEVER** import `@react-native-async-storage/async-storage` directly
2. **ALWAYS** use `LocalCache.ts` from `src/core/storage/cache/LocalCache.ts`
3. **NEVER** create custom AsyncStorage wrappers

### Correct Cache Usage:
```typescript
// ✅ CORRECT
import { LocalCache } from '@/src/core/storage/cache/LocalCache';

await LocalCache.setItem('key', value);
const data = await LocalCache.getItem('key');

// ❌ WRONG
import AsyncStorage from '@react-native-async-storage/async-storage';
```

## 🎨 UI Component & Styling Rules

### NativeWind Theme Usage:
1. **ALWAYS** support theme in UI components
2. **USE** existing theme system from `src/shared/themes/`
3. **NEVER** hardcode colors - use theme variables
4. **IMPORT** themed components from `src/shared/components/themed/`

### Component Creation Pattern:
```typescript
// ✅ CORRECT: Theme-aware component
import { View, Text } from '@/src/shared/components/themed';

export function MyComponent({ className = '' }: Props) {
  return (
    <View className={`p-4 bg-background ${className}`}>
      <Text variant="primary" size="lg">
        Theme-aware text
      </Text>
    </View>
  );
}

// ❌ WRONG: Hardcoded styles
import { View, Text } from 'react-native';

export function MyComponent() {
  return (
    <View style={{ padding: 16, backgroundColor: '#ffffff' }}>
      <Text style={{ color: '#000000' }}>Hardcoded text</Text>
    </View>
  );
}
```

### Theme Classes Available:
- **Background**: `bg-background`, `bg-card`, `bg-primary`
- **Text**: `text-foreground`, `text-muted-foreground`, `text-primary`
- **Borders**: `border-border`, `border-input`
- **Component variants**: Use `variant` and `size` props

## 📦 Import Guidelines

### Import Priority Order:
1. **React/React Native**: Core React imports
2. **External libraries**: Third-party packages
3. **Core layer**: `@/src/core/*`
4. **Shared layer**: `@/src/shared/*`
5. **Module layer**: `@/src/modules/*`
6. **Relative imports**: Same directory/module

### Import Patterns:
```typescript
// ✅ CORRECT: Import from module index
import { TodoUseCase, TodoRepository } from '@/src/modules/todo';
import { Button, Text } from '@/src/shared/components/themed';
import { LocalCache } from '@/src/core/storage';

// ❌ WRONG: Direct internal imports
import { TodoUseCase } from '@/src/modules/todo/useCases/TodoUseCase';
```

## 🧪 Testing Patterns

### Test File Locations:
- **Unit tests**: `src/modules/[module]/__tests__/`
- **Integration tests**: `src/modules/[module]/__tests__/integration/`
- **Component tests**: `src/modules/[module]/__tests__/components/`

### Test Structure:
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

## 🚫 Common Anti-Patterns to Avoid

### DON'T DO:
1. **Cross-module imports**: `src/modules/todo` importing from `src/modules/auth`
2. **Direct database access**: Components calling WatermelonDB directly
3. **Direct AsyncStorage**: Using AsyncStorage instead of LocalCache
4. **Hardcoded styles**: Not using theme system
5. **Global state pollution**: Putting module state in global store
6. **Breaking layers**: UI components importing from storage layer
7. **Circular dependencies**: Modules depending on each other

### DO:
1. **Use shared layer**: For cross-module functionality
2. **Follow dependency inversion**: Higher layers depend on abstractions
3. **Use repository pattern**: For all data access
4. **Create proper modules**: Self-contained with clear interfaces
5. **Use theme system**: For all UI styling
6. **Follow import guidelines**: Proper import hierarchy

## 📚 Documentation References

### Available Documentation:
- **README.md**: Comprehensive project guide
- **ARCHITECTURE.md**: Detailed technical architecture
- **src/core/storage/README.md**: Database architecture guide
- **Module README**: Each module should have its own documentation

### When Creating New Features:
1. **Read existing documentation** before starting
2. **Follow established patterns** in similar modules
3. **Update documentation** if adding new patterns
4. **Add module README** for complex features

## 🎯 Development Workflow

### Before Creating Any File:
1. **Identify the purpose**: What layer does this belong to?
2. **Check existing patterns**: Is there a similar file to follow?
3. **Determine dependencies**: What will this file import/export?
4. **Choose correct location**: Follow the folder structure rules
5. **Follow naming conventions**: Consistent naming across project

### Code Review Checklist:
- [ ] File in correct folder according to architecture
- [ ] Follows established patterns for the file type
- [ ] Uses proper imports (no anti-patterns)
- [ ] Supports theme system (if UI component)
- [ ] Uses LocalCache (not AsyncStorage directly)
- [ ] Uses repository pattern (no direct database access)
- [ ] Module has required Redux slice (if new module)
- [ ] Follows TypeScript best practices
- [ ] Updates relevant documentation

## 🎉 Success Indicators

### Well-Architected Code:
- **Clear separation**: Each file has single responsibility
- **Proper dependencies**: Dependencies flow inward
- **Consistent patterns**: Follows established conventions
- **Modular structure**: Features are self-contained
- **Theme support**: UI components work with theme system
- **Type safety**: Full TypeScript coverage
- **Testable**: Structure enables easy testing

This context file ensures consistent, maintainable, and scalable React Native development following clean architecture principles.