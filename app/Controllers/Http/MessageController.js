'use strict'
//les modèles
const Message = use('App/Models/Message')
const Announcement = use('App/Models/Announcement')
const Message_votes = use('App/Models/Message_votes')
const User = use('App/Models/User')
const Database = use('Database')
const erreurPerso = use('App/Exceptions/errorQCT')


class MessageController {
    //permet de supprimer un message , l'id du message est en paramètre d'uri (params.id)
    async destroy ({ params, request, response }) {
        let resultat = "non supprimé"
        const message = await Message.find(params.id)
     
        if(message){
            resultat="supprimé"
            await message.delete()
        }
        return response.json({
            valeur : resultat
        })
    
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
    }

    //fonction qui permet de récuperer tout les messages
    async index({ params, request, response, view }){
        if (request.ajax()) {
            
        const messages =  await await Message.all();
        
        return response.json(
            messages.toJSON()
        
        );
    }else{
        response.redirect('/')
    }
    }

    //fonction qui permet de créer un nouveau message, en paramètre d'uri l'id de l'annonce correspondant au nouveau message (params.id)
    async store({request, auth,params, response, session}) {
        try{
            const name_message = request.input("name_message")
            const announcement_id = params.id
            const announcementExist = await Announcement.find(announcement_id)
            if(announcementExist){
                let message = new Message()
                message.name_message = name_message
                message.announcement_id = params.id
                message.user_id = (await auth.getUser()).id //pour récuperer l'id de l'utilisateur connecté
                await message.save()

                // Quand on a ajouté une nouvelle annonce, l'utilisateur gagne 1 d'experience
                const user = await auth.getUser()
                User.incrementUserLevel(user,1)
                response.redirect('/announcement/'+params.id)
            }else{
                throw 'error'
            }
        }catch(error){
            session.flash({MessageAddError : 'Veuillez attendre 30 secondes entre chaque message'});
            return response.redirect('/message/store/announcement/'+params.id)
        }

    }

    //fonction qui permet de generer la vue de création de message (formulaire)
    //verifie que l'annonce existe avant de generer la vue
    async create({view,params}){
        
        const announce = await Announcement.find(params.id)
        if(announce){
        return view.render('message.store',{id : params.id})
        }else{
            try{
                throw 'error'
                
            }catch(e){console.log("test")
            throw new erreurPerso()}
        }
    } 

    //permet de mettre à jour une annonce
    async edit ({auth, view,params}) {
        const message = await Message.find(params.id)
        if(message){
            const user = await auth.getUser()
            
            if(user.id == message.user_id || user.admin == 1){
            
                return view.render('message.edit',{message : message,id:params.id})
            }
        }else{
            try{
                throw 'error'
            }catch(e){
            throw new erreurPerso()}
        }

    }
    async update({params,session,response,request}){
        try{
            const name_message = request.input('name_message')
            let message = await Message.find(params.id)
            if(message){
               
                message.name_message=name_message;
         
                message.save();
                session.flash({ editMessageSuccess: 'Modifié avec success'});
                return response.redirect('/message/'+params.id+'/edit')
            }
            return response.redirect('/')
        }catch(error){
          
            session.flash({editMessageError : 'Impossible de modifier le message'});
            return response.redirect('/message/'+params.id+'/edit')
            
        }

    }

    //fonction Ajax 
    //cette fonction est en fait la note que va attribuer l'utilisateur au message
    //increment signifie donc une note +1 pour un message
    async increment({response,auth,request}) {
        const user= await auth.getUser()
        const message_id=request.input("id");
        const message = await Message.find(message_id)
        if(message){
            const user_createur_message = await User.find(message.user_id)
            let vote = await Database.from('message_votes').where({ user_id: user.id,message_id: message_id })
            let voteExist = vote.length
           // vote =vote[0]['count(`id`)'] //0 si jamais voté avec ce compte
            if(voteExist >0){//on a deja voté sur ce poste
               
                if(!(vote[0]['vote']==1)){//on avait voté -1 la fois précedente
                    
                const affectedRows = await Database
                .table('message_votes')
                .where({ user_id: user.id,message_id: message_id })
                .update('vote', 1)
                //on augmenter l'experience du créateur du message de 2 (on annule le -1 d'avant et on lui donne 1 en plus)
                User.incrementUserLevel (user_createur_message,2)
                }
            }else{//on a jamais voté
                
                let vote_user = new Message_votes()
                vote_user.user_id = user.id
                vote_user.message_id = message_id
                vote_user.vote=1
                await vote_user.save()

                //on augmenter l'experience du créateur du message de 1
                User.incrementUserLevel (user_createur_message,1)
               
            }
            
        }
        return response.json({
            valeur : 'great'
        });
    }
    
    //fonction Ajax
    //cette fonction est en fait la note que va attribuer l'utilisateur au message
    //increment signifie donc une note -1
    async decrement({response,auth,request}) {
        const user= await auth.getUser()
        const message_id=request.input("id");
        const message = await Message.find(message_id)
        if(message){
            const user_createur_message = await User.find(message.user_id)
            let vote = await Database.from('message_votes').where({ user_id: user.id,message_id: message_id })
            let voteExist = vote.length
            if(voteExist >0){//on a deja voté
             
                if(!(vote[0]['vote']==-1)){//on avait voté +1 la première fois
                   
                const affectedRows = await Database
                .table('message_votes')
                .where({ user_id: user.id,message_id: message_id })
                .update('vote', -1)
                //on enleve l'experience du créateur du message de 2 (on annule le +1 d'avant et on lui enleve 1 en plus)
                User.decrementUserLevel (user_createur_message,2)
                }
            }else{//on a jamais voté
               
                let vote_user = new Message_votes()
                vote_user.user_id = user.id
                vote_user.message_id = message_id
                vote_user.vote=-1
                await vote_user.save()
                //on enleve 1 experience au créateur du message
                User.decrementUserLevel (user_createur_message,1)
            }
            
        }
        return response.json({
            valeur : 'great'
        });
    }

    //fonction Ajax
    //cette fonction va récuperer toutes les notes attribué à un message, va les additionner et va retourner la valeur de cette note
    //si on remarque que la note finale est "-10" le message est jugé comme non pertinent, on va donc automatiquement le supprimer
    async vote({response,params}) {
        let suppression = false
        const message_id=params.id;
        const message = await Message.find(message_id)
        if(message){
            let vote = await Database.from('message_votes').where('message_id',message_id).sum('vote')
            vote = vote[0]['sum(`vote`)']
            if(vote == null){
                vote = 0
            }else if(vote <= -10){ //les utilisateurs n'aiment pas cette annnonce...on va donc la supprimer
            await message.delete()
            suppression=true //on accepte la suppression
        }
            return response.json({
                valeur : vote,
                suppression: suppression
            });
        }
    }
}

module.exports = MessageController
