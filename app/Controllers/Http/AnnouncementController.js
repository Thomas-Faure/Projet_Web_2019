'use strict'

//appel des Modèles
const Announcement = use('App/Models/Announcement')
const Announcement_votes = use('App/Models/Announcement_votes')
const Announcement_Category = use('App/Models/Category')
const User = use('App/Models/User')
const Database = use('Database')


class AnnouncementController {

    //permet de supprimer une annonce dont l'id est passé en paramètre d'uri (params.id)
    async destroy ({ params,auth, response }) {
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



    //donne toutes les annonces de la base de donnée sous le format JSON
    async index({request, response}){
        if (request.ajax()) {
            
        const messages =  await Database.raw("select a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
        " from announcement a"+
       " join users on users.id=a.user_id"+
       " join category_announcement c on c.id_category_announcement=a.category_id"+
        " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id where a.created_at between adddate(now(),-7) and now()"+
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
    async index_category({params, request, response}){
        if (request.ajax()) {
        const messages =  await Database.raw("select a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
        " from announcement a"+
       " join users on users.id=a.user_id"+
       " join category_announcement c on c.id_category_announcement=a.category_id"+
        " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id"+
        " where c.id_category_announcement= ? and a.created_at between adddate(now(),-7) and now() "+
        " group by a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color order by a.id_announcement desc",[params.id])
        
        return response.json({
            valeur : messages[0]
        }
        );
    }else{
        response.redirect('/')
    }
    }

    //permet de récuperer toutes les annonces posté par un utilisateur passé en paramètre dans l'uri (params.id)
    async getUserAnnounces({ params, request, response}){
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

    //fonction qui récupère et envoie au format JSON les annonces d'une certaine catégorie correspondant à un utilisateur passé en paramètre d'uri (params.id et params.cat)
    async getUserAnnounces_category({params, request, response}){
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

    //fonction qui récupère une annonce via un paramètre passé dans l'uri (params.id)
    async show ({ params, response, view }) {

        
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

    //permet de mettre à jour une annonce
    async edit ({auth, view,params}) {
        const announcement = await Announcement.find(params.id)
        if(announcement){
            const user = await auth.getUser()
            
            if(user.id == announcement.user_id || user.admin == 1){
                const category = await Announcement_Category.all()

                return view.render('announcement.edit',{announcement : announcement,categorys:category.toJSON(),id:params.id})
            }
        }else{
            try{
                throw 'error'
            }catch(e){
            throw new erreurPerso()}
        }

    }
    async update({auth,view,params,session,response,request}){
        try{
            const user = await auth.getUser()
            const category_id = request.input('category_id')
            const name_announcement = request.input('name_announcement')
            const description = request.input('description')
            let announcement = await Announcement.find(params.id)
            if(announcement){
                if(announcement.user_id==user.id || user.admin ==1){
                    announcement.category_id=category_id;
                    announcement.name_announcement=name_announcement;
                    announcement.description=description;
                    announcement.save();
                    session.flash({ editAnnouncementSuccess: 'Modifié avec success'});
                    return response.redirect('/announcement/'+params.id+'/edit')
                }else{
                    throw 'error'
                }
            }
            return response.redirect('/')
        }catch(error){
          
            session.flash({editAnnouncementError : 'Impossible de modifier l\'annonce'});
            return response.redirect('/announcement/'+params.id+'/edit')
            
        }

    }

    //fonction qui permet de créer une annonce
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
    //fonction qui permet d'acceder à la page de création d'annonce (le formulaire)
    async create({view}){
        const category =  await Announcement_Category.all()
        
        return view.render('announcement.store',{categorys : category.toJSON()})
    } 

    
    //fonction qui permet de récuperer tout les messages d'une annonce spécifié en paramètre (params.id)
    async getMessages({response,params}){
      
      
        const messages =  await Database.raw("select users.admin as admin,level.color,users.id as user_id,id_message,message.announcement_id,message.created_at,name_message,username,sum(COALESCE(vote, 0)) as note"+
        " from message"+
       " join users on users.id=message.user_id"+
       " join level on users.level_id=level.id_level"+
        " left join message_votes on message.id_message=message_votes.message_id"+
        " where message.announcement_id=?"+
        " group by users.admin,users.id,id_message,message.announcement_id,message.created_at,name_message,username order by id_message desc",[params.id])
        
    
        return response.json({
            valeur : messages[0]
        }
        );
        
    }


    //fonction qui permet de retourner la dernière annonce posté
    async getLastAnnouncement({response,params,request}){
        if(request.ajax()){
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
            if(announcement.user_id != user.id){
                let vote = await Database.from('announcement_votes').where({ user_id: user.id,announcement_id: announcement_id })
                let voteExist = vote.length
            
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
                    User.incrementUserLevel (user,1) //on récompense la personne qui vote
                
                }
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
            if(announcement.user_id != user.id){
                let vote = await Database.from('announcement_votes').where({ user_id: user.id,announcement_id: announcement_id })
                let voteExist = vote.length
            
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
                    User.incrementUserLevel (user,1) //on récompense la personne qui vote
                
                }
            }
            
        }
        return response.json({
            valeur : 'success'
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
            }else if(vote <= -10){ //les utilisateurs n'aiment pas cette annnonce...on va donc la supprimer (10 votes négatifs !)
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
