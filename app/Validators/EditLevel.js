'use strict'

class EditLevel {
  get rules () {
    return {
      'name': 'required|min:2|max:80|regex:^[^<>]+$',
      'color': 'required|min:2|max:7|regex:#[a-zA-Z0-9]{6}',



    }
  }

  get messages(){
    return{
      'required' : ' Il faut remplir le champ',
      'max' : 'Nombre de caractères autorisé dépassé',
      'min' : 'Nombre de caractères doit être supérieur',
      'name.regex': 'ne peut contenir "<" ou ">"',
      'color.regex': 'la couleur doit être au format # suivit de 6 caractères'

    }
  }
  async fails(error){
    this.ctx.session.withErrors(error)
    .flashAll();
    return this.ctx.response.redirect('back');
}

}

module.exports = EditLevel
