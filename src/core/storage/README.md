# Storage Architecture for Scalable Apps

This directory contains a well-organized storage architecture designed for large applications with multiple databases, local caching, and backend synchronization needs.

## 📁 Directory Structure

```
src/storage/
├── README.md                    # This documentation
├── database.ts                  # Main WatermelonDB configuration
├── schema.ts                    # Aggregated schema from all databases
├── index.ts                     # Main exports for the storage module
├── cache/                       # AsyncStorage & Local Caching
│   ├── index.ts                # Cache module exports
│   └── LocalCache.ts           # Local cache implementation
└── database/                   # All database implementations
    ├── testdb/                 # WatermelonDB testing database
    │   ├── index.ts           # TestDB exports
    │   ├── models/            # Database models
    │   │   ├── index.ts       # Model exports
    │   │   └── TestUser.ts    # TestUser model
    │   ├── schema/            # Database schemas
    │   │   └── testUserSchema.ts # TestUser schema
    │   └── WatermelonDBTest.ts # Testing functions
    ├── todoapp/               # Todo application database
    │   ├── index.ts          # TodoApp exports
    │   ├── models/           # Todo models
    │   │   └── TodoStorage.ts # Todo storage implementation
    │   └── schema/           # Todo schemas (future)
    └── userdb/               # User database
        ├── index.ts          # UserDB exports
        ├── models/           # User models
        │   └── UserProfileStorage.ts # User profile storage
        └── schema/           # User schemas (future)
```

## 🎯 Design Principles

### 1. Database-Centric Organization
Each database has its own folder containing:
- **models/**: WatermelonDB models and storage classes
- **schema/**: Table schemas and migrations
- **index.ts**: Centralized exports for the database

### 2. Clear Separation of Concerns
- **cache/**: All AsyncStorage and local caching
- **database/**: All WatermelonDB databases
- Main files: Core configuration and aggregation

### 3. Scalable Structure
Easy to add new databases without affecting existing ones:
```bash
# Add new database
mkdir -p src/storage/database/analytics/{models,schema}
```

## 🚀 Adding New Databases

### Step 1: Create Database Folder
```bash
mkdir -p src/storage/database/[database-name]/{models,schema}
```

### Step 2: Add Models
```typescript
// src/storage/database/[database-name]/models/ExampleModel.ts
import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export default class ExampleModel extends Model {
  static table = 'example_table'
  
  @text('name') name!: string
  @field('is_active') isActive!: boolean
}
```

### Step 3: Add Schema
```typescript  
// src/storage/database/[database-name]/schema/exampleSchema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'example_table',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'is_active', type: 'boolean' }
      ]
    })
  ]
})
```

### Step 4: Create Database Index
```typescript
// src/storage/database/[database-name]/index.ts
export { default as ExampleModel } from './models/ExampleModel'
export { default as exampleSchema } from './schema/exampleSchema'
```

### Step 5: Update Main Configuration

1. **Add to main schema** (`src/storage/schema.ts`):
```typescript
import exampleSchema from './database/[database-name]/schema/exampleSchema'

export default appSchema({
  version: 2, // Increment version
  tables: [
    // existing schemas...
    ...exampleSchema.tables
  ]
})
```

2. **Add to database config** (`src/storage/database.ts`):
```typescript
import { ExampleModel } from './database/[database-name]'

export const database = new Database({
  adapter,
  modelClasses: [TestUser, ExampleModel], // Add new model
})
```

3. **Add to main exports** (`src/storage/index.ts`):
```typescript
export * from './database/[database-name]'
```

## 📱 AsyncStorage Caching (`/cache/`)

All local caching and AsyncStorage operations are centralized:

```typescript
import { LocalCache } from '@/src/storage'

// Store data
await LocalCache.setItem('user_preferences', preferences)

// Retrieve data
const userData = await LocalCache.getItem('user_profile')

// Clear cache
await LocalCache.clear()
```

### Adding New Cache Types
```bash
# Create specialized cache implementations
touch src/storage/cache/SessionCache.ts
touch src/storage/cache/ApiCache.ts
touch src/storage/cache/UserPreferencesCache.ts
```

## 🗄️ Database Examples

### TestDB (`/database/testdb/`)
- **Purpose**: WatermelonDB testing and demonstration
- **Models**: TestUser  
- **Usage**: Development and testing WatermelonDB functionality

### TodoApp (`/database/todoapp/`)
- **Purpose**: Todo and task management
- **Models**: TodoStorage (contains Todo interface and TodoStatus enum)
- **Usage**: Application todo functionality

### UserDB (`/database/userdb/`)
- **Purpose**: User profiles and authentication data
- **Models**: UserProfileStorage
- **Usage**: User management and profile data

## 🔄 Backend Synchronization Strategy

Each database can implement its own sync strategy:

```typescript
// In database-specific service files
export class TodoSyncService {
  async syncWithBackend(): Promise<void> {
    // Sync todos with /api/todos endpoint
  }
}

export class UserSyncService {
  async syncWithBackend(): Promise<void> {
    // Sync users with /api/users endpoint
  }
}
```

## 📊 Schema Versioning

- **Main schema** (`src/storage/schema.ts`): Aggregates all database schemas
- **Database schemas** (`src/storage/database/[db]/schema/`): Individual database schemas
- **Version management**: Increment main schema version when adding new databases

## 🧪 Testing Strategy

Each database can include its own tests:
```bash
# Create test files alongside models
src/storage/database/testdb/WatermelonDBTest.ts
src/storage/database/todoapp/TodoStorage.test.ts
src/storage/database/userdb/UserProfileStorage.test.ts
```

## 💡 Usage Patterns

### Import from Main Storage (Recommended)
```typescript
import { TestUser, TodoStorage, LocalCache, testWatermelonDB } from '@/src/storage'
```

### Import from Specific Database (For Database-Specific Operations)
```typescript
import { TestUser, testWatermelonDB } from '@/src/storage/database/testdb'
import { TodoStorage } from '@/src/storage/database/todoapp'
import { LocalCache } from '@/src/storage/cache'
```

## 🎉 Benefits

- **Scalability**: Easy to add new databases as the app grows
- **Maintainability**: Each database is self-contained
- **Team Collaboration**: Teams can work on different databases independently  
- **Clear Organization**: Related files are grouped together
- **Flexible Caching**: Centralized AsyncStorage management
- **Type Safety**: Full TypeScript support throughout

This architecture supports apps that can grow to handle multiple databases with hundreds of thousands of users and complex synchronization requirements.