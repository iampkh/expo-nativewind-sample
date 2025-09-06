import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'
import { TestUser } from './database/testdb'
import TodoModel from './database/models/TodoModel'
import NoteModel from './database/models/NoteModel'
import schema from './schema'

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'TestApp',
  migrations: schemaMigrations({
    migrations: [],
  }),
})

export const database = new Database({
  adapter,
  modelClasses: [TestUser, TodoModel, NoteModel],
})