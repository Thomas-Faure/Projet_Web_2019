'use strict'

class AddAnnouncement {
  get rules () {
    return {
      
      'name_message': 'required|min:2|max:80'
    
    }
  }

  get messages(){
    return{
      'required' : ' Il faut remplir le champs..',
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
