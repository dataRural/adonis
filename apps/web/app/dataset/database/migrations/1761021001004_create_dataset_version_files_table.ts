import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dataset_version_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('dataset_version_id')
        .unsigned()
        .references('id')
        .inTable('dataset_versions')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name', 255).notNullable()
      table.json('path').notNullable()
      table.boolean('is_primary').notNullable().defaultTo(false)
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
