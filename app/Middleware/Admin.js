'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const erreurPerso = use('App/Exceptions/CustomException')
class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */

  //permet de vérifier si un utlisateur est administrateur
  async handle({ auth,response }, next) {
    
      
      const user = await auth.getUser()
      if (user.admin == 1) {
        await next()
      } else {
        try {throw 'error'}catch(e){
          throw new erreurPerso("Unauthorized",401,"")
        }
      }
    
  }
}
module.exports = Admin