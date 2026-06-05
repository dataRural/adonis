import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'
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
  licenseId: number | null = null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => DatasetVersion)
  declare versions: HasMany<typeof DatasetVersion>

  @belongsTo(() => License)
  declare license: BelongsTo<typeof License>
}
