'use strict'
const Role = use('App/Models/Role')
const Database = use('Database')


class RoleController {
    async destroy ({ params, request, response }) {
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
		console.log("oui")
		console.log( await Database.select('*').from('role'))
    }

    async create({request, auth, response}) {

    }



}

module.exports = RoleController