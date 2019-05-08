'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BidVoteSchema extends Schema {
  up () {
    this.create('bid_votes', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('bid_id').unsigned().references('id').inTable('bid')
      table.integer('vote')

      table.timestamps()
    })
  }

  down () {
    this.drop('bid_votes')
  }
}

module.exports = BidVoteSchema
