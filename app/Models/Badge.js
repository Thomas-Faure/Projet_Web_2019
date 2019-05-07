'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Badge extends Model {
    static get table () {
        return 'badge'
    }
}

module.exports = Badge
