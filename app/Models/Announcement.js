'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Announcement extends Model {
    static get table () {
        return 'announcement'
    }
    static get primaryKey () {
        return 'id_announcement'
    }
}

module.exports = Announcement
