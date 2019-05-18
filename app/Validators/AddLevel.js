'use strict'

class AddAnnouncement {
  get rules () {
    return {
      'id_level': 'required|unique:level|integer|min:1',
      'name': 'required|min:2|max:80',
      'color': 'required|min:2|max:7',



    }
  }

  get messages(){
    return{
      'unique' : "ce numéro est deja pris",
      'integer' : 'Le numéro doit être un nombre',
      'required' : ' Il faut remplir le champ',
      'max' : 'Nombre de caractères autorisé dépassé',
      'min' : 'Nombre de caractères doit être supérieur'
    }
  }
  async fails(error){
    this.ctx.session.withErrors(error)
    .flashAll();
    return this.ctx.response.redirect('back');
}

}

module.exports = AddAnnouncement
