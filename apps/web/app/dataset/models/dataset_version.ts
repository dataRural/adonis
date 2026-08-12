import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'

import BaseModel from '#common/models/base_model'
import Dataset from '#app/dataset/models/dataset'
import DatasetVersionFile from './dataset_version_file.js'
import { attachment } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

export default class DatasetVersion extends compose(BaseModel, Auditable) {
  static auditableName = 'dataset_version'
  static auditExclude = ['path']
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare datasetId: number

  @column()
  declare name: string

  @column()
  declare notes: string | null

  @column()
  declare isDeleted: boolean

  @attachment()
  declare path: Attachment

  @belongsTo(() => Dataset)
  declare dataset: BelongsTo<typeof Dataset>

  @hasMany(() => DatasetVersionFile)
  declare files: HasMany<typeof DatasetVersionFile>
}
