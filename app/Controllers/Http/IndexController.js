'use strict'
const Announcement = use('App/Models/Announcement')
const Announcement_Category = use('App/Models/Category')
const Database = use('Database')


class IndexController {
    //afficher la vue d'accueil
    async index ({ view }) {
       
        return view.render('index')
    }
    //récupère les utilisateurs ainsi que leur niveau et rend la page de classement
    async ranking ({ view }) {
        const classement = await Database
        .raw('select id,level.name,level.color,username,exp,level_id,(exp+(100*level_id)) as points from users join level on level.id_level=users.level_id order by points desc', [])
       console.log(classement[0])
        return view.render('ranking',{rank : classement[0]})
    }


}

module.exports = IndexController
