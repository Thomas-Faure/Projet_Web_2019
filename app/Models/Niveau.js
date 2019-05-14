'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Niveau extends Model {
    static get table () {
        return 'level'
    }
    static get primaryKey () {
        return 'id_level'
    }
    
}

module.exports = Niveau
