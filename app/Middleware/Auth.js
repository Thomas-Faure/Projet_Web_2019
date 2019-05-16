'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Auth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */

  //permet d'envoyer dans le Header le token si l'utlisateur à stocké ce dernier dans ses cookies
  async handle({ request }, next) {
    //on récupere le cookie
    const token = request.cookie('Authorization')
    if (token != null) {

      const send_token = token['token']
      //on envoi au header une autorisation, ce qui va permettre d'identifier l'utilisateur grâce à une verification du token au niveau du serveur
      request.request.headers.authorization = `Bearer ${send_token}`
    }

    await next()
  }
}
module.exports = Auth
