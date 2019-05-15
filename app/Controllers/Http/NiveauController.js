'use strict'
const Niveau = use('App/Models/Niveau')
const Database = use('Database')


class NiveauController {
    async destroy ({ }) {
    }

    //permet de génerer la page pour modifier un niveau déja existant
    async edit ({ params, response, view,auth }) {
     
        let niveau = (await Niveau.find(params.id))
            if(niveau){
            
                return view.render('level.edit',{niveau : niveau,'id':params.id})
            }else{
                response.redirect('back')
            }
     
    }

    //retourne tout les niveaux existants
    async index ({request, response}) {
        if (request.ajax()) {
            
            const level =  await await Niveau.all();
            
            return response.json(
                level.toJSON()
            
            );
        }else{
            response.redirect('/')
        }
    }

    //permet de mettre à jour un niveau , l'id du niveau est passé en paramètre d'uri (params.id)
    //cette fonction redirige vers le backoffice des niveaux après modification
    async update ({ params, request, response, session}) {
        try{
            console.log("je suis dedans")
            const name = request.input('name')
            const color = request.input('color')
            let level = await Niveau.find(params.id)
            if(level){
                level.name=name;
                level.color=color;
                level.save();
            }
            return response.redirect('/backoffice/level')
        }catch(error){
            session.flash({editLevelError : 'Impossible de modifier le niveau'});
            return response.redirect('/level/'+params.id+'/edit')
            
        }

    }
    //permet de créer un nouveau niveau
    async store({request, response}) {
        try{
            const name = request.input("name")
            const color = request.input("color")
            let level = new Niveau()
            level.color = color
            level.name = name
            
            await level.save()

            response.redirect('/backoffice')
    
            }catch(error){
                session.flash({MdpError : 'Impossible de créer un niveau'});
                    return response.redirect('/level/store')
    
            }

    }



}

module.exports = NiveauController
