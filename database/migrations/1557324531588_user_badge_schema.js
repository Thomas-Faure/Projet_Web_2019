'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserBadgeSchema extends Schema {
  up () {
    this.create('user_badges', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('badge_id').unsigned().references('id').inTable('badge')
      table.boolean('visible').defaultTo(false)
      table.boolean('new').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('user_badges')
  }
}

module.exports = UserBadgeSchema
