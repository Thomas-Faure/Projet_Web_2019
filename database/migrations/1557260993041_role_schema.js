'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleSchema extends Schema {
  up () {
    this.create('role', (table) => {
      table.increments()
      table.string('name_role', 80).notNullable().unique()
      table.string('color', 7).notNullable()
      table.boolean('admin', 1).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('role')
  }
}

module.exports = RoleSchema
