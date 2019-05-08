'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NiveauSchema extends Schema {
  up () {
    this.create('niveau', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('color', 7).notNullable()
    })
  }

  down () {
    this.drop('niveau')
  }
}

module.exports = NiveauSchema
