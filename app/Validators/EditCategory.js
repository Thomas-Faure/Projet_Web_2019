'use strict'

class AddCategory {
  get rules () {
    return {
      
      'name_category': 'required|min:2|max:255',
      'color': 'required|min:0|max:7'
     
    
    }
  }

  get messages(){
    return{
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

module.exports = AddCategory
