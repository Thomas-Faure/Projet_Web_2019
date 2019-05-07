'use strict'
const User = use('App/Models/User')
const Database = use('Database')


class UserController {


    async test({request, auth, response}){
        try {
            await auth.check()
            return await auth.getUser()
        } catch (error) {
            response.send('Missing or invalid jwt token')
        }
    }
    async register({request, auth, response}) {
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
        user.level = 0
        user.exp = 0
        user.role_id = 1
        await user.save()
        let accessToken = await auth.attempt(email, password)

        response.redirect('/')
    }
    async logout({request, auth, response}) {
        response.cookie('Authorization', 1,{ httpOnly: true, path: '/' })
        response.redirect('/')
    }

    async login({request, auth, response}) {

        let {email, password} = request.all();

        try {

            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
               let token = await auth.generate(user)
                response.cookie('Authorization', token,{ httpOnly: true, path: '/' })
                //return response.json({"user": user, "access_token": token})
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
