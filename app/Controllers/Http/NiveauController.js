'use strict'
const Niveau = use('App/Models/Niveau')
const erreurPerso = use('App/Exceptions/CustomException')
class NiveauController {

    /**
    * 
    *  CREATE
    * 
    * Verb : POST
    *
    */

    //permet de créer un nouveau niveau
    async store({ request, response,session }) {
        try {
            const id_level = request.input("id_level")
            const name = request.input("name")
            const color = request.input("color")
            var format = /[<>]/;
            if (format.test(name)) {
                session.flash({ LevelError: 'Contient des caractères spéciaux' });
                return response.redirect('/level/store')
            }
            let level = new Niveau()
            level.id_level = id_level
            level.color = color
            level.name = name
            await level.save()
            response.redirect('/backoffice/level')
        } catch (error) {
            session.flash({ LevelError: 'Impossible de créer un niveau (duplication niveau)' });
            return response.redirect('/level/store')
        }
    }

    /**
    * 
    *  READ
    * 
    * Verb : GET
    *
    */

    //permet de génerer la page pour modifier un niveau déja existant
    async edit({ params, view,response}) {
        let niveau = (await Niveau.find(params.id))
        if (niveau) {
            return view.render('level.edit', { niveau: niveau, 'id': params.id })
        } else {
            try {
                throw 'error'
            } catch (e) {
                throw new erreurPerso("Not found",404,"E_ROUTE")
            }
        }
    }
    //retourne tout les niveaux existants
    async index({ request, response }) {
        if (request.ajax()) {
            const level = await await Niveau.all();
            return response.json(
                level.toJSON()
            );
        } else {
            response.redirect('/')
        }
    }


    /**
    * 
    *  UPDATE
    * 
    * Verb : PUT
    *
    */

    //permet de mettre à jour un niveau , l'id du niveau est passé en paramètre d'uri (params.id)
    //cette fonction redirige vers le backoffice des niveaux après modification
    async update({ params, request, response, session }) {
        try {
            var format = /[<>]/;
            const name = request.input('name')
            const color = request.input('color')
            if (format.test(name)) {
                session.flash({ editLevelError: 'Contient des caractères spéciaux' });
                return response.redirect('/level/' + params.id + '/edit')
           
            }
            let level = await Niveau.find(params.id)
            if (level) {
                level.name = name;
                level.color = color;
                level.save();
            }
            return response.redirect('/backoffice/level')
        } catch (error) {
            session.flash({ editLevelError: 'Impossible de modifier le niveau' });
            return response.redirect('/level/' + params.id + '/edit')
        }
    }

    /**
    * 
    *  DELETE
    * 
    * Verb : DELETE
    *
    */


    //on interdit la suppression d'un niveau

}
module.exports = NiveauController
