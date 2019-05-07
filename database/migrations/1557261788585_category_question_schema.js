'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategoryQuestionSchema extends Schema {
  up () {
    this.create('category_question', (table) => {
      table.increments()
      table.string('name_category', 255)
      table.timestamps()
    })
  }

  down () {
    this.drop('category_question')
  }
}

module.exports = CategoryQuestionSchema
