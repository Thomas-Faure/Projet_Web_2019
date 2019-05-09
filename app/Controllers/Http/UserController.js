'use strict'
const User = use('App/Models/User')
const Database = use('Database')


class UserController {
    async destroy ({ params, request, response }) {
    }

    async update ({ params,auth, request, response, view,session }) {
        const user = (await auth.getUser())
        if(user.id == params.id){
            try{
                const name = request.input('name')
                const username = request.input('username')
                const email = request.input('email')

                let userEdit = await User.find(params.id)

                userEdit.name = name
                userEdit.email = email
                userEdit.username = username
        
                await userEdit.save()
                return response.redirect('/user/edit')
            }catch(error){
                session.flash({EditError : 'Email ou Username deja pris'});
            return response.redirect('/user/edit')
            }
        }else{
            response.redirect('/')
        }
    }

    async show ({ params, request, auth, response, view }) {
        const user = await User.find(params.id)
        if(user){
        return view.render('user.profile',{user : user})
        }else{
            return response.redirect('back')
        }
        
    }

    

    async store({request, auth, response}) {
        const username = request.input("username")
        const email = request.input("email")
        const password = request.input("password")
        const birthday = request.input("birthday")
        const name = request.input("name")

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
    }


    async edit ({ auth, view,params,response }) {
        const user = (await auth.getUser())
        if(user.id == params.id){

        return view.render('user.edit',{user : user.toJSON()})
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
