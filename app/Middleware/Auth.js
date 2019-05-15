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
  async handle ({ request }, next) {
    const token = request.cookie('Authorization')
    if(token != null) {
      const send_token = token['token']
      request.request.headers.authorization = `Bearer ${send_token}`
    }

    await next()
  }
}
module.exports = Auth
