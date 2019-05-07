'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BadgeSchema extends Schema {
  up () {
    this.create('badge', (table) => {
      table.increments()
      table.string('name_badge', 80).notNullable().unique()
      table.string('photo', 254).notNullable()
      table.integer('exp', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('badge')
  }
}

module.exports = BadgeSchema
