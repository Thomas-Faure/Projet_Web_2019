'use strict'
const Niveau = use('App/Models/Niveau')
const Database = use('Database')


class NiveauController {
    async destroy ({ params, request, response }) {
    }

    async edit ({ params, request, response, view }) {
        let niveau = (await Niveau.find(params.id))
            if(niveau){
           
                return view.render('level.edit',{niveau : niveau,'id':params.id})
            }else{
                response.redirect('back')
            }
     
    }


    async index ({ params, request, response, view }) {
        if (request.ajax()) {
            
            const level =  await await Niveau.all();
            
            return response.json(
                level.toJSON()
            
            );
        }else{
            response.redirect('/')
        }
    }

    async update ({ params, request, response, view , session}) {
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

    async store({request, auth, response}) {
        try{
            const name = request.input("name")
            const color = request.input("color")
            if(password != passwordValidation){
                throw "error"
            }
            let level = new Niveau()
            level.color = color
            level.name = name
            
            await name.save()

            response.redirect('/backoffice')
    
            }catch(error){
                session.flash({MdpError : 'Impossible de créer un niveau'});
                    return response.redirect('/level/store')
    
            }

    }



}

module.exports = NiveauController
