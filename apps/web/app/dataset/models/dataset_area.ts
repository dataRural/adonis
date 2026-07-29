import { column } from '@adonisjs/lucid/orm'
import BaseModel from '#common/models/base_model'

export default class DatasetArea extends BaseModel {
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
