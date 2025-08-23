import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'
import schema from './schema'
import { TestUser } from './models'

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'TestApp',
  migrations: schemaMigrations({
    migrations: [],
  }),
})

export const database = new Database({
  adapter,
  modelClasses: [TestUser],
})