'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response, session }) {
    /*if (error.name === 'ValidationException') {
      session.withErrors(error.messages).flashAll()
      await session.commit()
      response.redirect('back')
      return
    }else if (error.code === 'E_ROUTE_NOT_FOUND' || error.code === 'E_GUEST_ONLY' || error.code === 'E_INVALID_JWT_TOKEN' || error.status == 401) {
      return response.redirect('/error/404')
    }
    response.status(error.status).send(error.message)*/
    if (error.name === 'ValidationException') {
      session.withErrors(error.messages).flashAll()
      await session.commit()
      response.redirect('back')
      return
    }

    response.status(error.status).send(error.message)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
