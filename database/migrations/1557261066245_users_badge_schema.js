'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersBadgeSchema extends Schema {
  up () {
    this.create('users_badge', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('badge_id').unsigned().references('id').inTable('badge')
      table.boolean('visible', 1).notNullable()
    })
  }

  down () {
    this.drop('users_badge')
  }
}

module.exports = UsersBadgeSchema
