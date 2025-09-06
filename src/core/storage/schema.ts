import { appSchema, tableSchema } from '@nozbe/watermelondb'

/**
 * Main WatermelonDB schema aggregating all database schemas
 * When adding new databases, import their schemas and add to tables array
 */
export default appSchema({
  version: 1,
  tables: [
    // TestDB schemas
    tableSchema({
      name: 'test_users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'age', type: 'number' }
      ]
    }),
    // Todo schemas
    tableSchema({
      name: 'todos',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    })
  ]
})