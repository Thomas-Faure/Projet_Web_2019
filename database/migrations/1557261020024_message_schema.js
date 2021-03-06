'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('message', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('user')
      table.integer('bid_id').unsigned().references('id').inTable('bid')
      table.string('name_message', 80).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('message')
  }
}

module.exports = MessageSchema
