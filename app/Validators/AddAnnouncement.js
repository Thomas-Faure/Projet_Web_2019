'use strict'
class AddAnnouncement {
  get rules () {
    return {
      'category_id': 'required',
      'name_announcement': 'required|min:2|max:80|regex:^[^<>]+$',
      'description': 'required|min:2|max:255|regex:^[^<>]+$'
    }
  }

  get messages(){
    return{
      'required' : ' Il faut remplir le champ',
      'max' : 'Nombre de caractères autorisé dépassé',
      'min' : 'Nombre de caractères doit être supérieur',
      'regex': 'Ne peut contenir "<" ou ">"'
    }
  }
  async fails(error){
    this.ctx.session.withErrors(error)
    .flashAll();
    return this.ctx.response.redirect('back');
}

}

module.exports = AddAnnouncement