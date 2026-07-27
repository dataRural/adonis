import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'group_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .string('role', 20)
        .notNullable()
        .defaultTo('viewer')
        .checkIn(['owner', 'admin', 'editor', 'viewer'])

      table.unique(['group_id', 'user_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
