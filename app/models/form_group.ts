import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Cv from './cv.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FormGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title:string

  @column()
  declare type:string

  @column()
  declare cvId: string

  @column()
  declare order: number

  @column()
  declare visible: boolean

  @belongsTo(() => Cv)
  public Cv!: BelongsTo<typeof Cv>

  @column()
  declare data: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}