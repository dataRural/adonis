import { belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'
import GroupMember from '#app/groups/models/group_member'
import Dataset from '#app/dataset/models/dataset'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare ownerId: number

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => GroupMember)
  declare memberships: HasMany<typeof GroupMember>

  @manyToMany(() => User, {
    pivotTable: 'group_members',
    pivotColumns: ['role'],
    pivotTimestamps: true,
  })
  declare members: ManyToMany<typeof User>

  @hasMany(() => Dataset)
  declare datasets: HasMany<typeof Dataset>
}
