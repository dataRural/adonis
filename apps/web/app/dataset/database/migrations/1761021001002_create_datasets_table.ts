import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'datasets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table
        .integer('license_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('licenses')
        .onDelete('SET NULL')
      table.string('path', 1024).notNullable()
      table.boolean('is_public').notNullable().defaultTo(false)
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.string('unit', 255).notNullable()
      table.string('area', 255).notNullable()
      table.string('period', 255).nullable()
      table.string('region', 255).nullable()
      table.jsonb('tags').nullable()
      table.decimal('usability_score', 3, 1).nullable().defaultTo(8.5)
      table.string('status', 50).notNullable().defaultTo('unpublished')
      table.text('description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
