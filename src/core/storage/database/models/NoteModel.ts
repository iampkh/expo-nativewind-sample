import { Model } from '@nozbe/watermelondb'
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators'

export default class NoteModel extends Model {
  static table = 'notes'

  @text('title') title!: string
  @text('content') content!: string
  @text('priority') priority!: string
  @field('completed') completed!: boolean
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}