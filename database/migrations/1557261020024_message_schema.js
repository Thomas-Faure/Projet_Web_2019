'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('message', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('question_id').unsigned().references('id').inTable('question')
      table.string('libelle_message', 80).notNullable()
      table.string('nbComplaint_message', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('message')
  }
}

module.exports = MessageSchema
