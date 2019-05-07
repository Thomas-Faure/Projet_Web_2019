'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestionSchema extends Schema {
  up () {
    this.create('question', (table) => {
      table.increments()
      table.integer('category_id').unsigned().references('id').inTable('category_question')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name_question', 80).notNullable().unique()
      table.integer('nbComplaint_question', 60).notNullable()
      table.integer('vote', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('question')
  }
}

module.exports = QuestionSchema
