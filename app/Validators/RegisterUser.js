'use strict'

class RegisterUser {
  get rules () {
    return {
      'name': 'required|max:80',
      'username': 'required|unique:users|max:80',
      'birthday': 'required',
      'email': 'required|email|unique:users|max:254',
      'password': 'required|min:3|max:60'



    }
  }

  get messages(){
    return{
      'required' : ' Il faut remplir le champ : {{ field }}...',
      'unique' : ' Il se trouve que {{ field }} existe deja...',
      'email' : ' Vous devez mettre un email dans ce champ...',
      'max' : 'Nombre de caractère autorisé dépassé',
      'min' : 'Nombre de caractère doit être supérieur'
    }
  }

}

module.exports = RegisterUser
