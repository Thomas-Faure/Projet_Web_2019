'use strict'

class EditUser {
  get rules () {
    return {
      'name': 'required|max:80|regex:^[a-zA-Z0-9-\']+$',
      'username': 'required|max:80|regex:^[a-zA-Z0-9-\']+$',
      'birthday': 'required',
      'email': 'required|email|max:254',
      'password': 'min:3|max:60',
      'passwordValidation': 'same:password',


    }
  }

  get messages(){
    return{
      'required' : ' Il faut remplir le champ...',
      'unique' : ' Il se trouve que cet élement existe deja...',
      'email' : ' Vous devez mettre un email dans ce champ...',
      'max' : 'Nombre de caractères autorisé dépassé',
      'min' : 'Nombre de caractères doit être supérieur',
      'same': 'Le mot de passe ne correspond pas',
      'regex': 'ce n\'est pas un champ valide'
    }
  }
  async fails(error){
    this.ctx.session.withErrors(error)
    .flashAll();
    return this.ctx.response.redirect('back');
}

}

module.exports = EditUser
