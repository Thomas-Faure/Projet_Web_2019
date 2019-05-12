'use strict'
const Message = use('App/Models/Message')
const Announcement = use('App/Models/Announcement')
const Message_votes = use('App/Models/Message_votes')
const User = use('App/Models/User')
const Database = use('Database')


class MessageController {
    async destroy ({ params, request, response }) {
        let resultat = "non supprimé"
        const message = await Message.find(params.id)
        console.log(message)
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

    async create({view,params}){
        

        return view.render('message.store',{id : params.id})
    } 

        //fonction Ajax qui retourne la nouvelle valeur d'un message
    //cette fonction est en fait la note que va attribuer l'utilisateur au message
    //increment signifie donc une note +1
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
    
        //fonction Ajax qui retourne la nouvelle valeur d'un message
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

    //fonction Ajax qui retourne la nouvelle valeur de l'annonce
    //cette fonction est en fait la note que va attribuer l'utilisateur à l'annonce
    //increment signifie donc une note -1
    async vote({response,params}) {
        let suppression = false
        const message_id=params.id;
        const message = await Message.find(message_id)
        if(message){
            let vote = await Database.from('message_votes').where('message_id',message_id).sum('vote')
            vote = vote[0]['sum(`vote`)']
            if(vote == null){
                vote = 0
            }else if(vote <= -1){ //les utilisateurs n'aiment pas cette annnonce...on va donc la supprimer
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
