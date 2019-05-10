'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Niveau extends Model {
    static get table () {
        return 'niveau'
    }
    static get primaryKey () {
        return 'id_niveau'
    }
    
}

module.exports = Niveau
