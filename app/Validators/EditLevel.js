'use strict'

class AddAnnouncement {
  get rules () {
    return {
      'name': 'required|min:2|max:80',
      'color': 'required|min:2|max:7',



    }
  }

  get messages(){
    return{
      'required' : ' Il faut remplir le champ : {{ field }}...',
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

module.exports = AddAnnouncement
