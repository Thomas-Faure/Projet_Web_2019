'use strict'
const User = use('App/Models/User')
const Database = use('Database')


class UserController {
    async destroy ({ params, request, response }) {
        let resultat = "non supprimé"
        const user = await User.find(params.id)
        console.log(user)
        if(user){
            resultat="supprimé"
            await user.delete()
        }
        return response.json({
            valeur : resultat
        })
    
    }

    async update ({ params,auth, request, response, view,session }) {
        const user = (await auth.getUser())
        if(user.id == params.id){
            
            try{
                const name = request.input('name')
                const username = request.input('username')
                const email = request.input('email')
                const password = request.input('password')
                const birthday = request.input('birthday')
                const passwordValidation = request.input('passwordValidation')
                let userEdit = await User.find(params.id)
           
                    if(password != null){
                       
                        if(password == passwordValidation){
                            userEdit.password = password
                        }else{
                            throw 'error'
                        }
                    }
                    userEdit.name = name
                    userEdit.birthday = birthday
             
                    userEdit.email = email
    
                    userEdit.username = username
                
                const result = await userEdit.save()
            
                if(result){
                    session.flash({EditSuccess : 'Toutes les modifications sont faites !'});
                    return response.redirect('/user/'+user.id+'/edit/')
                }else{
                   
                    throw "error";
                }
            }catch(error){
               
                session.flash({EditError : 'Aucune modification n\' a pu etre faite !'});
                return response.redirect('/user/'+user.id+'/edit/')
            }
        }else{
            response.redirect('/')
        }
    }

    async show ({ params, request, auth, response, view }) {
        const user = await User.find(params.id)
        if(user){
            //on récupères ses 5 dernieres annonces
            const announcements = await Database
            .raw('select a.id_announcement as id,u.username as username,a.name_announcement as name_announcement,c.color as color,c.image as image from announcement a join category_announcement c on a.category_id = c.id_category_announcement join users u on u.id=a.user_id where u.id=?  order by a.id_announcement desc limit  ?', [user.id,5])
            
            //on récupère les données utilisateurs
            var date = new Date(user.birthday),
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
            user.birthday= [ day, mnth, date.getFullYear() ].join("-");
            return view.render('user.profile',{user : user.toJSON(),announcements : announcements[0]})
        }else{
            return response.redirect('back')
        }
        
    }

    async index({ params, request, response, view }){
        if (request.ajax()) {
            
        const users =  await await User.all();
        
        return response.json(
            users.toJSON()
        
        );
    }else{
        response.redirect('/')
    }
    }
    

    

    async store({request, auth, response, session}) {
        try{
        const username = request.input("username")
        const email = request.input("email")
        const password = request.input("password")
        const passwordValidation = request.input("passwordValidation")
        const birthday = request.input("birthday")
        const name = request.input("name")
        if(password != passwordValidation){
            throw "error"
        }
        let user = new User()
        user.username = username
        user.email = email
        user.password = password
        user.birthday= birthday
        user.name = name
        user.niveau_id = 1
        user.exp = 0
        user.admin = 0
        await user.save()
        let accessToken = await auth.attempt(email, password)
        return user.id
        response.redirect('/')

        }catch(error){
            session.flash({MdpError : 'Le mot de passe de confirmation ne correpond pas !'});
                return response.redirect('/user/register')

        }
        
    }


    async edit ({ auth, view,params,response }) {
        const user = (await auth.getUser())
        if(user.id == params.id){
            var date = new Date(user.birthday),
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
            user.birthday= [ date.getFullYear(), mnth, day ].join("-");
       
        return view.render('user.edit',{user : user})
        }
        return response.redirect('back')
        
    }



    async logout({request, auth, response}) {
   
        response.cookie('Authorization', 1,{ httpOnly: true, path: '/' })
        response.redirect('/')
    }

    
    

    async login({request, auth, response,session}) {

        let {email, password} = request.all();

        try {

            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
               let token = await auth.generate(user)
                response.cookie('Authorization', token,{ httpOnly: true, path: '/' })
                
                response.redirect('/')
            }

        }
        catch (error) {
            session.flash({loginError : 'Les identifiants ne correspondent pas'});
            return response.redirect('/user/login')
        }
    }
}

module.exports = UserController
