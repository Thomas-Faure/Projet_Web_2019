'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MessageVote extends Model {
    static get table () {
        return 'message_votes'
    }
    static get primaryKey () {
        return 'id_message_vote'
    }
}

module.exports = MessageVote
