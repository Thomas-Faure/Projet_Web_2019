'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategoryBidSchema extends Schema {
  up () {
    this.create('category_bid', (table) => {
      table.increments()
      table.string('name_bid', 255)
      table.timestamps()
    })
  }

  down () {
    this.drop('category_bid')
  }
}

module.exports = CategoryBidSchema
