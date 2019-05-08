'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('user', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('name', 80).notNullable()
      table.dateTime('birthday', 6).notNullable()
      table.integer('exp', 80).notNullable()
      table.boolean('admin', 1).notNullable()
      table.integer('niveau_id').unsigned().references('id').inTable('niveau')
      table.timestamps()
    })
  }

  down () {
    this.drop('user')
  }
}

module.exports = UserSchema
