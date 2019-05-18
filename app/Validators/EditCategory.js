'use strict'

class EditCategory {
  get rules () {
    return {
      
      'name_category': 'required|min:2|max:255|regex:^[^<>]+$',
      'color': 'required|min:0|max:7|regex:#[a-zA-Z0-9]{6}'
     
    
    }
  }

  get messages(){
    return{
      'required' : ' Il faut remplir le champ',
      'max' : 'Nombre de caractères autorisé dépassé',
      'min' : 'Nombre de caractères doit être supérieur',
      'name_category.regex': 'Ne peut contenir le caratère "<" ou ">"',
      'color.regex': 'la couleur doit être au format # suivit de 6 caractères'
    }
  }
  async fails(error){
    this.ctx.session.withErrors(error)
    .flashAll();
    return this.ctx.response.redirect('back');
}

}

module.exports = EditCategory
