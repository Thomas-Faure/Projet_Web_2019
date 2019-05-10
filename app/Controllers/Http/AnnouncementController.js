'use strict'
const Announcement = use('App/Models/Announcement')
const Announcement_votes = use('App/Models/Announcement_votes')
const Announcement_Category = use('App/Models/Category')
const Message = use('App/Models/Message')
const User = use('App/Models/User')
const Database = use('Database')


class AnnouncementController {
    async destroy ({ params, request, response }) {
    }

    async edit ({ params, request, response, view }) {
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

                response.redirect('/page/1')
            }else{
                throw 'error'
            }
        }catch(error){
            session.flash({AnnouncementAddError : 'Veuillez à ne pas trafiquer le formulaire ;)'});
            return response.redirect('/announcement/store')
        }

    }
    async create({view}){
        const category =  await Announcement_Category.all()
        
        return view.render('announcement.store',{categorys : category.toJSON()})
    } 

    

    async getMessages({response,params}){
      
        const messages =  await Database.raw("select id_message,message.announcement_id,message.created_at,name_message,username,sum(COALESCE(vote, 0)) as note"+
        " from message"+
       " join users on users.id=message.user_id"+
        " left join message_votes on message.id_message=message_votes.message_id"+
        " where message.announcement_id=?"+
        " group by id_message,message.announcement_id,message.created_at,name_message,username order by id_message desc",[params.id])
        
    
        return response.json({
            valeur : messages[0]
        }
        );
        
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
        const announcement_id=params.id;
        const announcement = await Announcement.find(announcement_id)
        if(announcement){
            let vote = await Database.from('announcement_votes').where('announcement_id',announcement_id).sum('vote')
            
            vote = vote[0]['sum(`vote`)']
            if(vote == null){
                vote = 0
            }
            return response.json({
                valeur : vote
            });
        }
        return response.json({
            valeur : '0'
        });
    }

 



}

module.exports = AnnouncementController
