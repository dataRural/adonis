import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'
import Group from '#app/groups/models/group'
import type GroupMemberRole from '#app/groups/enums/group_member_role'

export default class GroupMember extends BaseModel {
  static table = 'group_members'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare groupId: number

  @column()
  declare userId: number

  @column()
  declare role: GroupMemberRole

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
