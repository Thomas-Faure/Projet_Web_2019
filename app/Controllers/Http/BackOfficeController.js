'use strict'
const User = use('App/Models/User')
const Database = use('Database')



class BackOfficeController {

    /**
     * 
     *  READ
     * 
     * Verb : GET
     *
     */

    //permet d'envoyer l'utilisateur sur la vue principale du backoffice
    async index({ view }) {

        return view.render('backoffice.index')
    }
    //permet d'envoyer l'utilisareur sur la vue qui va afficher via une requête (Ajax) les messages correspondant à une annonce passé en paramètre d'uri (params.id)
    async messages({ view, params }) {
        return view.render('backoffice.message', { id: params.id })
    }
















}

module.exports = BackOfficeController
