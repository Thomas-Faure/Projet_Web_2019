'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageVoteSchema extends Schema {
  up () {
    this.create('message_votes', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('message_id').unsigned().references('id').inTable('message')
      table.integer('vote')

      table.timestamps()
    })
  }

  down () {
    this.drop('message_votes')
  }
}

module.exports = MessageVoteSchema
