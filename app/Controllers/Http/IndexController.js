'use strict'
const Announcement = use('App/Models/Announcement')
const Announcement_Category = use('App/Models/Category')
const Database = use('Database')


class IndexController {
    async index ({ view }) {
       
        return view.render('index')
    }
    async ranking ({ view }) {
        const classement = await Database
        .raw('select id,username,exp,niveau_id,(exp+(10*niveau_id)) as points from users order by points desc', [])
        //console.log(classement[0])
        return view.render('ranking',{rank : classement[0]})
    }
    async page ({ view }){
        
        const announcement = await Database
        .select('announcement.id','announcement.name_announcement as name_announcement',
        Database.raw('DATE_FORMAT(announcement.created_at, "%Y-%m-%d %H:%i") as date'),
        'users.username as username','category_announcement.name_announcement as name_cat',
        'category_announcement.color as color')
        .from('announcement')
        .crossJoin('users', 'announcement.user_id', 'users.id')
        .crossJoin('category_announcement', 'announcement.category_id', 'category_announcement.id').orderBy('announcement.id', 'desc')
     
        return view.render('page',{announcements : announcement})
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
    }

    async create({request, auth, response}) {

    }



}

module.exports = IndexController
