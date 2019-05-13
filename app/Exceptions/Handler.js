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
  async handle (error, { request, response, view }) {
 
    console.log(error.status)
    if (error.name === 'ValidationException') {
      session.withErrors(error.messages).flashAll()
      await session.commit()
     // response.redirect('/')
     // return
    }
    if (error.status == '404') {
    
      return response.redirect('/error/404')
      
    }
    if (error.status == '403') {
    
      return response.redirect('/error/403')
    }
    if (error.status == '401') {
    
      return response.redirect('/error/401')
    }
    if (error.status == '500') {
    
      return response.redirect('/error/500')
    }
   // response.redirect('/')

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