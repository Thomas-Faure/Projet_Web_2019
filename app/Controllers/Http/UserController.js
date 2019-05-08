'use strict'
const User = use('App/Models/User')
const Database = use('Database')


class UserController {
    async destroy ({ params, request, response }) {
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
    }

    async create({request, auth, response}) {
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
        response.redirect('/')
    }
    async logout({request, auth, response}) {
        response.cookie('Authorization', 1,{ httpOnly: true, path: '/' })
        response.redirect('/')
    }
    async test({request, auth, response}){
        try {
            console.log( (await auth.getUser()).id)
     
          } catch (error) {
            response.send('You are not logged in')
        }
    }

    async login({request, auth, response}) {

        let {email, password} = request.all();

        try {

            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
               let token = await auth.generate(user)
                response.cookie('Authorization', token,{ httpOnly: true, path: '/' })
                console.log(token)
                response.redirect('/')
            }

        }
        catch (e) {
            console.log(e)
            return response.json({message: 'You are not registered!'})
        }
    }
}

module.exports = UserController
