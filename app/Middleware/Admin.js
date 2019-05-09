'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request,auth,response }, next) {
    try{
        const user =await auth.getUser()
        console.log(user.admin)
        if(user.admin == 1){
            await next()
        }else{
            response.status(403).send("non autorisé")
        }
    }catch(error){
        response.status(403).send("non autorisé")
    }
  }
}
module.exports = Admin
