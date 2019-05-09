'use strict'
const Niveau = use('App/Models/Niveau')
const Database = use('Database')


class NiveauController {
    async destroy ({ params, request, response }) {
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
		console.log("oui")
		console.log( await Database.select('*').from('niveau'))
    }

    async create({request, auth, response}) {

    }



}

module.exports = NiveauController
