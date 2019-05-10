'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CategoryAnnouncement extends Model {
    static get table () {
        return 'category_announcement'
    }
    static get primaryKey () {
        return 'id_category_announcement'
    }
}

module.exports = CategoryAnnouncement
