import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'
import Group from '#app/groups/models/group'
import DatasetVersion from './dataset_version.js'
import License from './license.js'

export default class Dataset extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare path: string

  @column()
  declare isPublic: boolean

  @column()
  declare userId: number

  @column()
  declare unit: string

  @column()
  declare area: string

  @column()
  declare period: string | null

  @column()
  declare region: string | null

  @column({
    prepare: (value: any) => value ? JSON.stringify(value) : null,
    consume: (value: any) => {
      if (!value) return []
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value
    },
  })
  declare tags: string[]

  @column()
  declare usabilityScore: number

  @column()
  declare status: string

  @column()
  licenseId: number | null = null

  @column()
  declare groupId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>

  @hasMany(() => DatasetVersion)
  declare versions: HasMany<typeof DatasetVersion>

  @belongsTo(() => License)
  declare license: BelongsTo<typeof License>
}
