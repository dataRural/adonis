import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BaseModel from '#common/models/base_model'
import User from '#users/models/user'
import Dataset from './dataset.js'

export default class DatasetLike extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare datasetId: number

  @column()
  declare userId: number

  @belongsTo(() => Dataset)
  declare dataset: BelongsTo<typeof Dataset>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
