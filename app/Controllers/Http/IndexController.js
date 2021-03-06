'use strict'

const Database = use('Database')


class IndexController {

    /**
    * 
    *  READ
    * 
    * Verb : GET
    *
    */
   
    //afficher la vue d'accueil
    async index({ view }) {
        return view.render('index')
    }
    //récupère les utilisateurs ainsi que leur niveau et rend la page de classement
    async ranking({ view }) {
        const classement = await Database
            .raw('select id,level.name,level.color,username,exp,level_id,(exp+(100*level_id)) as points from users join level on level.id_level=users.level_id order by points desc limit 10', [])
        return view.render('ranking', { rank: classement[0] })
    }


}

module.exports = IndexController