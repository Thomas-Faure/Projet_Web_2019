'use strict'

class AddLevel {
  get rules () {
    return {
      'id_level': 'required|unique:level|integer|min:1',
      'name': 'required|min:2|max:80|regex:^[^<>]+$',
      'color': 'required|min:2|max:7|regex:#[a-zA-Z0-9]{6}',



    }
  }

  get messages(){
    return{
      'unique' : "ce numéro est deja pris",
      'integer' : 'Il doit s\'agir d\'un nombre',
      'required' : ' Il faut remplir le champ',
      'max' : 'Nombre de caractères autorisé dépassé',
      'min' : 'Nombre de caractères doit être supérieur',
      'name.regex': 'Ne peut contenir "<" ou ">"',
      'color.regex': 'la couleur doit être au format # suivit de 6 caractères'
    }
  }
  async fails(error){
    this.ctx.session.withErrors(error)
    .flashAll();
    return this.ctx.response.redirect('back');
}

}

module.exports = AddLevel
