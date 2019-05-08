'use strict'
const Bid = use('App/Models/Bid')
const Database = use('Database')


class IndexController {
    async index ({ view }) {
        //const bid = await Bid.all()
        const bid = await Database
        .select('bid.name_bid as name_bid',
        Database.raw('DATE_FORMAT(bid.created_at, "%Y-%m-%d %H:%i") as date'),
        'users.username as username','category_bid.name_bid as name_cat',
        'category_bid.color as color')
        .from('bid')
        .crossJoin('users', 'bid.user_id', 'users.id')
        .crossJoin('category_bid', 'bid.category_id', 'category_bid.id')
        return view.render('index',{bids : bid})
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
    }

    async create({request, auth, response}) {

    }



}

module.exports = IndexController
