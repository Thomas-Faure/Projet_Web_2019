'use strict'

class EditUser {
  get rules () {
    return {
      'name': 'required|max:80',
      'username': 'required|max:80',
      'birthday': 'required',
      'email': 'required|email|max:254',
      'password': 'min:3|max:60'

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
  async fails(error){
    this.ctx.session.withErrors(error)
    .flashAll();
    return this.ctx.response.redirect('back');
}

}

module.exports = EditUser
