'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }
  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
  static incrementUserLevel (user,valeur) {
    let new_exp= user.exp+valeur;
    if(new_exp >= (user.level_id*10)){ 
         user.exp = new_exp-(user.level_id*10)
         user.level_id= user.level_id+1
    }else{
          user.exp = new_exp
    }
    user.save()

  }
  static decrementUserLevel (user,valeur) {
  
    let new_lvl= user.exp-valeur;
    
    if(new_lvl < 0){
        if(user.level_id==1){
          user.level_id=1
          user.exp=0
        }else{
         let new_level = user.level_id-1
         user.level_id = new_level
         user.exp = (new_level*10)+new_lvl
        }
         
    }else{
          user.exp = new_lvl
    }
    user.save()
  }
}

module.exports = User
