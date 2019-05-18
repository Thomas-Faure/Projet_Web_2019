'use strict'

class LogUser {
    get rules () {
        return {
            'email': 'required|email',
            'password': 'required'

        }
    }

    get messages(){
        return{
            'required' : ' Il faut remplir le champ...',
            'unique' : ' Il se trouve que l\'élément existe deja...',
            'email' : ' Vous devez mettre un email dans ce champ...'
        }
    }
    async fails(error){
        this.ctx.session.withErrors(error)
        .flashAll();
        return this.ctx.response.redirect('back');
    }

}

module.exports = LogUser
