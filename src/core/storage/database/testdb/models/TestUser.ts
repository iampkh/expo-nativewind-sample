import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export default class TestUser extends Model {
  static table = 'test_users'

  @text('name') name!: string
  @text('email') email!: string  
  @field('age') age!: number
}