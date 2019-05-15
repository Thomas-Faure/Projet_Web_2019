'use strict'

class EditAnnouncement {
  get rules () {
    return {
      'category_id': 'required',
      'name_announcement': 'required|min:2|max:80',
      'description': 'required|min:2|max:255'


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

module.exports = EditAnnouncement
