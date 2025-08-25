import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators'
import { TodoStatus } from './Todo'

export default class TodoModel extends Model {
  static table = 'todos'

  @text('title') title!: string
  @text('description') description!: string
  @text('date') date!: string
  @text('status') status!: TodoStatus
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}