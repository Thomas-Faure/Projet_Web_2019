'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CategoryBid extends Model {
    static get table () {
        return 'category_bid'
    }
}

module.exports = CategoryBid
