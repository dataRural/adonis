import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'

import BaseModel from '#common/models/base_model'
import DatasetVersion from '#app/dataset/models/dataset_version'
import { attachment } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

export default class DatasetVersionFile extends compose(BaseModel, Auditable) {
  static auditableName = 'dataset_version_file'
  static auditExclude = ['path']

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare datasetVersionId: number

  @column()
  declare name: string

  @column()
  declare isPrimary: boolean

  @column()
  declare sortOrder: number

  @attachment()
  declare path: Attachment

  @belongsTo(() => DatasetVersion)
  declare version: BelongsTo<typeof DatasetVersion>
}
