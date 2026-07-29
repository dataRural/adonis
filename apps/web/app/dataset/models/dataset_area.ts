import { column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import BaseModel from '#common/models/base_model'

export default class DatasetArea extends compose(BaseModel, Auditable) {
  static auditableName = 'dataset_area'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare icon: string

  @column()
  declare color: string

  @column()
  declare description: string | null
}
