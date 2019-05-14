'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const erreurPerso = use('App/Exceptions/errorQCT')
class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request,auth,response }, next) {
    try{

        const user =await auth.getUser()
        if(user.admin == 1){
            await next()
        }else{
          throw new erreurPerso()
        }
    }catch(error){
      throw new erreurPerso()
    }
  }
}
module.exports = Admin