'use strict'
const Announcement = use('App/Models/Announcement')
const Announcement_votes = use('App/Models/Announcement_votes')
const Announcement_Category = use('App/Models/Category')
const Message = use('App/Models/Message')
const User = use('App/Models/User')
const Database = use('Database')


class AnnouncementController {
    async destroy ({ params, request,auth, response }) {
        const user = await auth.getUser()
        let resultat = "non supprimé"
        const announcement = await Announcement.find(params.id)
        if(announcement){
            if(announcement.user_id == user.id || user.admin ==1){
                resultat="supprimé"
                await announcement.delete()
            }
        }
        return response.json({
            valeur : resultat
        })
    
    }

    async edit ({ params, request, response, view }) {
    }

    //donne toutes les annonces en format json
    async index({ params, request, response, view }){
        if (request.ajax()) {
            
        const messages =  await Database.raw("select a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
        " from announcement a"+
       " join users on users.id=a.user_id"+
       " join category_announcement c on c.id_category_announcement=a.category_id"+
        " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id"+
        " group by a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color order by a.id_announcement desc",[])
        
        return response.json({
            valeur : messages[0]
        }
        );
    }else{
        response.redirect('/')
    }
    }
    //donne toutes les annonces (suivant un filtre) en format json
    async index_category({params, request, response, view }){
        if (request.ajax()) {
        const messages =  await Database.raw("select a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
        " from announcement a"+
       " join users on users.id=a.user_id"+
       " join category_announcement c on c.id_category_announcement=a.category_id"+
        " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id"+
        " where c.id_category_announcement= ?"+
        " group by a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color order by a.id_announcement desc",[params.id])
        
        return response.json({
            valeur : messages[0]
        }
        );
    }else{
        response.redirect('/')
    }
    }


    async getUserAnnounces({ params, request, response, view }){
        if (request.ajax()) {
            
        const messages =  await Database.raw("select distinct(a.id_announcement),users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
        " from announcement a"+
       " join users on users.id=a.user_id"+
       " join message m on m.announcement_id = a.id_announcement"+
       " join category_announcement c on c.id_category_announcement=a.category_id"+
        " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id"+
        " where m.user_id = ? group by a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color order by a.id_announcement desc",[params.id])
        return response.json({
            valeur : messages[0]
        }
        );
    }else{
        response.redirect('/')
    }
    }

    async getUserAnnounces_category({params, request, response, view }){
        if (request.ajax()) {
        const messages =  await Database.raw("select a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
        " from announcement a"+
       " join users on users.id=a.user_id"+
       " join message m on m.announcement_id = a.id_announcement"+
       " join category_announcement c on c.id_category_announcement=a.category_id"+
        " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id"+
        " where c.id_category_announcement= ?"+
        " and m.user_id = ? group by a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color order by a.id_announcement desc",[params.cat,params.id])
        return response.json({
            valeur : messages[0]
        }
        );
    }else{
        response.redirect('/')
    }
    }

    async show ({ params, request, response, view }) {

        
        const announcement = await Announcement.find(params.id)
        if(announcement){
            let announce_note = await Database.from('announcement_votes').where('announcement_id',params.id).sum('vote')
            
            announce_note = announce_note[0]['sum(`vote`)']
           
            if(announce_note == null || announce_note == 0){
                announce_note = '0'
            }
          
           const announce = await Announcement.query().innerJoin('category_announcement','announcement.category_id','category_announcement.id_category_announcement').innerJoin('users','users.id','announcement.user_id').where('announcement.id_announcement',params.id).fetch()
            
            return view.render('announcement.profile',{announcement: announce.toJSON ()[0],announce_note: announce_note,id:params.id})
        }else{
            return response.redirect('back')
        }
    }

    async store({request, auth, response, session}) {
        try{
            const name_announcement = request.input("name_announcement")
            const description = request.input("description")
            const category_id = request.input("category_id")
            const categoryExist = await Announcement_Category.find(category_id)
            if(categoryExist){
                let announcement = new Announcement()
                announcement.name_announcement = name_announcement
                announcement.description = description
                announcement.category_id = category_id
                announcement.user_id = (await auth.getUser()).id //pour récuperer l'id de l'utilisateur connecté
                await announcement.save()

                // Quand on a ajouté une nouvelle annonce, l'utilisateur gagne 1 d'experience
                const user = await auth.getUser()
                User.incrementUserLevel(user,1)

                response.redirect('/announcement/category/all')
            }else{
                throw 'error'
            }
        }catch(error){
            session.flash({AnnouncementAddError : 'Veuillez attendre 10 minutes entre chaque création d\'annonce;)'});
            return response.redirect('/announcement/store')
        }

    }
    async create({view}){
        const category =  await Announcement_Category.all()
        
        return view.render('announcement.store',{categorys : category.toJSON()})
    } 

    

    async getMessages({response,params}){
      
        //const messages = Message.getMessages(params.id)
        const messages =  await Database.raw("select users.admin as admin,users.id as user_id,id_message,message.announcement_id,message.created_at,name_message,username,sum(COALESCE(vote, 0)) as note"+
        " from message"+
       " join users on users.id=message.user_id"+
        " left join message_votes on message.id_message=message_votes.message_id"+
        " where message.announcement_id=?"+
        " group by users.admin,users.id,id_message,message.announcement_id,message.created_at,name_message,username order by id_message desc",[params.id])
        
    
        return response.json({
            valeur : messages[0]
        }
        );
        
    }

    async getLastAnnouncement({response,params,request}){
        if(request.ajax()){
        //const messages = Message.getMessages(params.id)
        const announce =  await Announcement.query().innerJoin('category_announcement','category_announcement.id_category_announcement','announcement.category_id').orderBy('id_announcement','desc').limit(1).first()
    
        return response.json(
            announce.toJSON()
        
        );
    }else{
        response.redirect('/')
    }
        
    }


    //fonction Ajax qui retourne la nouvelle valeur de l'annonce
    //cette fonction est en fait la note que va attribuer l'utilisateur à l'annonce
    //increment signifie donc une note +1
    async increment({response,auth,request}) {
        const user= await auth.getUser()
        const announcement_id=request.input("id");
        const announcement = await Announcement.find(announcement_id)
        if(announcement){
            const user_createur_announcement = await User.find(announcement.user_id)
            let vote = await Database.from('announcement_votes').where({ user_id: user.id,announcement_id: announcement_id })
            let voteExist = vote.length
           // vote =vote[0]['count(`id`)'] //0 si jamais voté avec ce compte
            if(voteExist >0){
               
                if(!(vote[0]['vote']==1)){
                
                const affectedRows = await Database
                .table('announcement_votes')
                .where({ user_id: user.id,announcement_id: announcement_id })
                .update('vote', 1)
                //on enleve le poste negatif donc +1 et +1 pour le vote
                User.incrementUserLevel(user_createur_announcement,2)
                }
            }else{
                
                let vote_user = new Announcement_votes()
                vote_user.user_id = user.id
                vote_user.announcement_id = announcement_id
                vote_user.vote=1
                await vote_user.save()
                //on ajoute 1 à l'experience du créateur
                User.incrementUserLevel(user_createur_announcement,1)
               
            }
            
        }
        return response.json({
            valeur : 'great'
        });
    }
    
    //fonction Ajax qui 
    //cette fonction est en fait la note que va attribuer l'utilisateur à l'annonce
    //increment signifie donc une note -1
    async decrement({response,auth,request}) {
        const user= await auth.getUser()
        const announcement_id=request.input("id");
        const announcement = await Announcement.find(announcement_id)
        if(announcement){
            const user_createur_announcement = await User.find(announcement.user_id)
            let vote = await Database.from('announcement_votes').where({ user_id: user.id,announcement_id: announcement_id })
            let voteExist = vote.length
           // vote =vote[0]['count(`id`)'] //0 si jamais voté avec ce compte
            if(voteExist >0){
               
                if(!(vote[0]['vote']==-1)){
                const affectedRows = await Database
                .table('announcement_votes')
                .where({ user_id: user.id,announcement_id: announcement_id })
                .update('vote', -1)
                //on enleve le poste negatif donc +1 et +1 pour le vote
                User.decrementUserLevel(user_createur_announcement,2)
                }
            }else{
              
                let vote_user = new Announcement_votes()
                vote_user.user_id = user.id
                vote_user.announcement_id = announcement_id
                vote_user.vote=-1
                await vote_user.save()
                //on enlenve 1 à l'experience du créateur
                User.decrementUserLevel(user_createur_announcement,1)
               
            }
            
        }
        return response.json({
            valeur : 'great'
        });
    }

    //fonction Ajax qui retourne la nouvelle valeur de l'annonce
    //cette fonction est en fait la note que va attribuer l'utilisateur à l'annonce
    //increment signifie donc une note -1
    async vote({response,params}) {
        let suppression = false //indique si le poste va être supprimé ou non
        const announcement_id=params.id;
        const announcement = await Announcement.find(announcement_id)
        if(announcement){
            let vote = await Database.from('announcement_votes').where('announcement_id',announcement_id).sum('vote')
            
            vote = vote[0]['sum(`vote`)']
            if(vote == null){
                vote = 0
            }else if(vote <= -1){ //les utilisateurs n'aiment pas cette annnonce...on va donc la supprimer
                await announcement.delete()
                suppression=true //on accepte la suppression
            }
            return response.json({
                valeur : vote,
                suppression: suppression
            });
        }
        return response.json({
            valeur : '0',
            suppression: false
        });
    }

 



}

module.exports = AnnouncementController
