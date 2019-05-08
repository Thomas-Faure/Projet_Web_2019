'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BidSchema extends Schema {
  up () {
    this.create('bid', (table) => {
      table.increments()
      table.integer('category_id').unsigned().references('id').inTable('category_bid')
      table.integer('user_id').unsigned().references('id').inTable('user')
      table.string('name_bid', 80).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('bid')
  }
}

module.exports = BidSchema
