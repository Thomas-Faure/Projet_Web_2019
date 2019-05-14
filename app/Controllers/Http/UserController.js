'use strict'
const User = use('App/Models/User')
const Announcement = use('App/Models/Announcement')
const Database = use('Database')
const erreurPerso = use('App/Exceptions/errorQCT')


class UserController {
    async destroy ({ params, request, response }) {
        let resultat = "non supprimé"
        const user = await User.find(params.id)
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
        if(user.id == params.id || user.admin == 1){//si c'est le bon utilisateur ou soit si il est admin
            
            try{
                const admin = request.input('admin')
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
                    if(user.admin ==1 &&  (admin == 0 || admin == 1) ){
                        userEdit.admin = admin
                    }
                    userEdit.name = name
                    userEdit.birthday = birthday
             
                    userEdit.email = email
    
                    userEdit.username = username
                
                const result = await userEdit.save()
            
                if(result){
                    session.flash({EditSuccess : 'Toutes les modifications sont faites !'});
                    return response.redirect('/user/'+userEdit.id+'/edit/')
                }else{
                   
                    throw "error";
                }
            }catch(error){
               
                session.flash({EditError : 'Aucune modification n\' a pu etre faite !'});
                return response.redirect('/user/'+user.id+'/edit/')
            }
        }else{
            try{throw new erreurPerso()}catch(e){}
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
            
        const users =  await User.all();
        
        return response.json(
            users.toJSON()
        
        );
    }else{
        response.redirect('/')
    }
    }


    async participation_category({params, request, response, view }){
        if (request.ajax()) {
        const messages =  await Database.raw("select a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
        " from announcement a"+
       " join users on users.id=a.user_id"+
       " join category_announcement c on c.id_category_announcement=a.category_id"+
        " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id"+
        " where c.id_category_announcement= ?"+
        " group by a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color order by a.id_announcement desc",[params.cat])
        
        return response.json({
            valeur : messages[0]
        }
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

        //pour verifier que la date n'est pas trop ancienne ni trop recente
        var q = new Date()
        var m = q.getMonth()+1
        var d = q.getDay()
        var y = q.getFullYear()
        var date = new Date(y,m,d)
        let temp = new Date(birthday)
        if((temp.getMonth()+1)>=date.getMonth() && temp.getFullYear() >=date.getFullYear()){
            session.flash({MdpError : 'La date de naissance est trop grosse!'});
                return response.redirect('/user/register')
        }else if(temp.getFullYear() < 1900){
            session.flash({MdpError : 'La date de naissance est trop ancienne... !'});
                return response.redirect('/user/register')
        }else{
            console.log("c'est bon")
        }
        if(password != passwordValidation){
            console.log("erreur")
            throw "error"
        }
       
        let user = new User()
        user.username = username
        user.email = email
        user.password = password
        user.birthday= birthday
        user.name = name
        await user.save()
        let accessToken = await auth.attempt(email, password)
        response.redirect('/')

        }catch(error){
            console.log(error)
            session.flash({MdpError : 'Le mot de passe de confirmation ne correpond pas !'});
                return response.redirect('/user/register')

        }
        
    }


    async edit ({ auth, view,params,response }) {
        const user_actual = await auth.getUser()
        if(user_actual.id == params.id || user_actual.admin == 1){
            let user = (await User.find(params.id))
            var date = new Date(user.birthday),
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
            user.birthday= [ date.getFullYear(), mnth, day ].join("-");
       
        return view.render('user.edit',{user : user})
        }else{
            try{
                throw 'error'
                
            }catch(e){
            throw new erreurPerso()}
        }
        
    }

    async announcements({request, auth, view,response,params}) {
         
            const user = await auth.getUser()
       
            if(user.id == params.id){
   
                return view.render('user.announcement',{id : params.id})
            }else{
                try{
                    throw 'error'
                    
                }catch(e){
                throw new erreurPerso()}

            }
    }
    
    async getAnnouncements({request, auth, response,params}) {
        if (request.ajax()) {
            const user = await auth.getUser()
          
            if(user.id == params.id){
                try{
                    const announcements =  await Database.raw("select a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color,sum(COALESCE(vote, 0)) as note"+
                    " from announcement a"+
                   " join users on users.id=a.user_id"+
                   " join category_announcement c on c.id_category_announcement=a.category_id"+
                    " left join announcement_votes on a.id_announcement=announcement_votes.announcement_id"+
                    " where a.user_id= ?"+
                    " group by a.id_announcement,users.username,a.created_at,a.name_announcement,c.image,c.color order by a.id_announcement desc",[params.id])
                    
                return response.json({
                    valeur : announcements[0]
                })
                }catch(e){
                    console.log(e)
                }
            }
        }else{
            try{
                throw 'error'
                
            }catch(e){
            throw new erreurPerso()}

        }
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
