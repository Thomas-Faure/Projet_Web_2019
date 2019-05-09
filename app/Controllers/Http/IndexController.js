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
        .raw('select id,username,exp,niveau_id,(exp+(100*niveau_id)) as points from users order by points desc', [])
        //console.log(classement[0])
        return view.render('ranking',{rank : classement[0]})
    }
    async page ({ view,params,response }){
            var nbPostPerPage = 5 //on choisit 5 poste par page
            const count = await Database
            .from('announcement')
            .count() 
            const total = count[0]['count(*)']
        
            let nbPages = 0;
           
            console.log((Math.trunc(total))%5)
            if((Math.trunc(total))%5 == 0){//pair
                nbPages = (Math.trunc(total/nbPostPerPage))
            }else{//impair
                nbPages = (Math.trunc(total/nbPostPerPage))+1
            }
            
            
            if(nbPages<params.id){
                return response.redirect('/page/'+nbPages)
            }else if(params.id<1){
                return response.redirect('/page/1')
            }
            
            
            var offset = 5*params.id-5;
           
            console.log(offset)
        

            const announcement = await Database
            .raw('select a.id as id,u.username as username,a.name_announcement as name_announcement,c.color as color,c.image as image from announcement a join category_announcement c on a.category_id = c.id join users u on u.id=a.user_id  order by a.id desc limit ? offset ?', [nbPostPerPage,offset])
            
        
        
            return view.render('page',{announcements : announcement[0],nbPages : nbPages,id : params.id})
        
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
    }

    async create({request, auth, response}) {

    }



}

module.exports = IndexController
