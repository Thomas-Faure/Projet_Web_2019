'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AnnouncementVote extends Model {
    static get table () {
        return 'announcement_votes'
    }
    static get primaryKey () {
        return 'id_announcement_vote'
    }
}

module.exports = AnnouncementVote
