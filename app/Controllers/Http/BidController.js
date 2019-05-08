'use strict'
const Bid = use('App/Models/Bid')
const Database = use('Database')


class BidController {
    async destroy ({ params, request, response }) {
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
    }

    async create({request, auth, response}) {
        const name_bid = request.input("name_bid")

        let bid = new Bid()
        bid.name_bid = name_bid
        bid.category_id = 1
        bid.user_id = (await auth.getUser()).id //pour récuperer l'id de l'utilisateur connecté
        await bid.save()
        response.redirect('/')

    }



}

module.exports = BidController
