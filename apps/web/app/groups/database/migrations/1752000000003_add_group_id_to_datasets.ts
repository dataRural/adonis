import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'datasets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('group_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('groups')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('group_id')
    })
  }
}
