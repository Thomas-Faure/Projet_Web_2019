'use strict'
const User = use('App/Models/User')
const Level = use('App/Models/Niveau')
const Database = use('Database')
const erreurPerso = use('App/Exceptions/errorQCT')


class UserController {

    //fonction qui permet de supprimer un utilsiateur
    async destroy ({ params, response }) {
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
    //fonction qui permet de mettre à jour un utilisateur
    //seulement un administrateur ou bien l'utilisateur lui même à le droit d'effectuer cette modification
    async update ({ params,auth, request, response,session }) {
        const user = (await auth.getUser())
        if(user.id == params.id || user.admin == 1){//si c'est le bon utilisateur ou soit si il est admin

            try{
                var format = /[ !@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
                const admin = request.input('admin')
                const name = request.input('name')
                const username = request.input('username')
                const email = request.input('email')
                const password = request.input('password')
                const birthday = request.input('birthday')
                const passwordValidation = request.input('passwordValidation')
                if(format.test(name)){
                    session.flash({EditError : 'Votre nom contient des caractères non accepté'});
                    return response.redirect('/user/'+params.id+'/edit/')
                }else if(format.test(username)){
                    session.flash({EditError : 'Votre pseudo contient des caractères non accepté'});
                    return response.redirect('/user/'+params.id+'/edit/')
                }
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

    //fonction qui permet de récuperer les informations d'un utilisateur 
    //permet également de récuperer ses 5 dernières annonces postées
    async show ({ params, response, view }) {
        const user = await User.find(params.id)
        if(user){
            //on récupères ses 5 dernieres annonces
            const announcements = await Database
            .raw('select a.id_announcement as id,u.username as username,a.name_announcement as name_announcement,c.color as color,c.image as image from announcement a join category_announcement c on a.category_id = c.id_category_announcement join users u on u.id=a.user_id where u.id=?  order by a.id_announcement desc limit  ?', [user.id,5])

            const level = await Level.query().select('level.color','level.name').innerJoin('users','users.level_id','level.id_level').where('users.id',params.id).first()
            //on transforme la date
            var date = new Date(user.birthday),
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
            user.birthday= [ day, mnth, date.getFullYear() ].join("-");
            return view.render('user.profile',{user : user.toJSON(),announcements : announcements[0],level : level.toJSON()})
        }else{
            return response.redirect('back')
        }

    }

    //permet de récuperer tout les utilisateurs de la base de donnée
    async index({request, response}){
        if (request.ajax()) {

        const users =  await User.all();

        return response.json(
            users.toJSON()

        );
    }else{
        response.redirect('/')
    }
    }


    //permet de récuperer toutes les annonces dans lesquels un utilisateur a participé (pas les siennes)
    async participation_category({params, request, response}){
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

    //permet de créer un nouvel utilisateur
    //redirige vers la page principale dès que cela est fait, sinon retourne vers le formulairec d'inscription avec un message d'erreur
    async store({request, auth, response, session}) {
        try{
        var format = /[ !@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
        const username = request.input("username")
        const email = request.input("email")
        const password = request.input("password")
        const passwordValidation = request.input("passwordValidation")
        const birthday = request.input("birthday")
        const name = request.input("name")

        if(format.test(name)){
            session.flash({RegisterError : 'Votre nom contient des caractères non accepté'});
            return response.redirect('/user/register')
        }else if(format.test(username)){
            session.flash({RegisterError : 'Votre pseudo contient des caractères non accepté'});
            return response.redirect('/user/register')
        }

        //pour verifier que la date n'est pas trop ancienne ni trop recente
        var q = new Date()
        var m = q.getMonth()+1
        var d = q.getDay()
        var y = q.getFullYear()
        var date = new Date(y,m,d)
        let temp = new Date(birthday)
        if((temp.getMonth()+1)>=date.getMonth() && temp.getFullYear() >=date.getFullYear()){
            session.flash({RegisterError : 'La date de naissance est trop grosse!'});
                return response.redirect('/user/register')
        }else if(temp.getFullYear() < 1900){
            session.flash({RegisterError : 'La date de naissance est trop ancienne... !'});
                return response.redirect('/user/register')
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
        //let accessToken = await auth.attempt(email, password)
        session.flash({ RegisterSuccess: 'Vous êtes maintenant inscrit ! Veuillez vous connecter'});
        return response.redirect('/')

        }catch(error){
            console.log(error)
            session.flash({RegisterError : 'Le mot de passe de confirmation ne correspond pas !'});
                return response.redirect('/user/register')

        }

    }

    //permet de mettre à jour un utilisateur
    async edit ({auth, view,params}) {
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

    //permet de génerer la page des annonces posté par l'utilisateur
    //dans cette vue , il y a un appel (Ajax) qui va récuperer toutes les annonces d'un utilisateur qui est passé en paramètre de cette fonction (params.id)
    async announcements({auth, view,params}) {

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

    //permet de récuperer les annonces qu'un utilisateur à posté (son id est passé en paramètre d'uri (params.id))
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
    //permet à un utilisateur connecté de se déconnecter
    async logout({response}) {
        response.clearCookie('Authorization')
      //  response.cookie('Authorization', 1,{ httpOnly: true, path: '/' }) // on enlève le token du cookie
        response.redirect('/')
    }

    //permet à un utilisateur de se connecter
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
