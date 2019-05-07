'use strict'

class RegisterUser {
  get rules () {
    return {
      'name': 'required',
      'username': 'required|unique:users',
      'birthday': 'required',
      'email': 'required|email|unique:users',
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

module.exports = RegisterUser
