import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'
import Group from '#app/groups/models/group'
import type GroupMemberRole from '#app/groups/enums/group_member_role'

export default class GroupMember extends compose(BaseModel, Auditable) {
  static auditableName = 'group_member'
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
