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
            'required' : ' Il faut remplir le champ : {{ field }}...',
            'unique' : ' Il se trouve que {{ field }} existe deja...',
            'email' : ' Vous devez mettre un email dans ce champ...'
        }
    }

}

module.exports = LogUser
