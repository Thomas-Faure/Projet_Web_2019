'use strict'
const Bid = use('App/Models/Bid')
const Database = use('Database')


class IndexController {
    async index ({ view }) {
        const bid = await Bid.all()
        return view.render('index',{bids : bid.toJSON()})
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
    }

    async create({request, auth, response}) {

    }



}

module.exports = IndexController
