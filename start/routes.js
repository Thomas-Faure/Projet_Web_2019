'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.on('/').render('index')
Route.get('page/:id','IndexController.page').middleware(['auth'])
Route.get('ranking','IndexController.ranking').middleware(['auth'])

/**                    ERROR                                               */
Route.get('error/:id',async ({view, params }) => {
    return view.render('error',{id : params.id})
  })
/**                 PARTIE UTILISATEUR                                     */


//pour déconnecter un utilisateur


//chemin pour la connexion utilisateur


Route
  .group(() => {
    Route.on('login').render('user.login').middleware(['guest'])
    Route.post('login','UserController.login').validator('LogUser');

    Route.get(':id/edit','UserController.edit').middleware(['auth'])
    Route.post(':id/edit','UserController.update').validator('EditUser');

    Route.on('register').render('user.register').middleware(['guest'])
    Route.post('register','UserController.store').validator('RegisterUser');

    Route.get('logout', 'UserController.logout').middleware(['auth'])
    Route.get(':id','UserController.show').middleware(['auth'])
    
  })
  .prefix('user')



/**                 PARTIE BADGE                                     */



/**                 PARTIE NIVEAU                                     */



/**                 PARTIE announcement                                 */
Route
  .group(() => {
    Route.get('store','AnnouncementController.create').middleware(['auth'])
    Route.post('store','AnnouncementController.store').validator('AddAnnouncement');
    Route.post('increment','AnnouncementController.increment').middleware(['auth'])
    Route.post('decrement','AnnouncementController.decrement').middleware(['auth'])
    Route.get(':id/vote','AnnouncementController.vote').middleware(['auth'])
    Route.get(':id/messages','AnnouncementController.getMessages').middleware(['auth'])
    Route.get(':id','AnnouncementController.show').middleware(['auth'])
    
  })
  .prefix('announcement')








/**                 PARTIE MESSAGE                                     */
Route
  .group(() => {
    Route.get('store/announcement/:id','MessageController.create').middleware(['auth'])
    Route.post('store/announcement/:id','MessageController.store').validator('AddMessage');
    Route.post('increment','MessageController.increment').middleware(['auth'])
    Route.post('decrement','MessageController.decrement').middleware(['auth'])
    Route.get(':id/vote','MessageController.vote').middleware(['auth'])
  })
  .prefix('message')
/**                 PARTIE CATEGORY_QUESTION                                     */



/**                 PARTIE BACKOFFICE                                     */

//page accueil admin
Route.get('backoffice','BackOfficeController.index').middleware(['admin'])
Route.on('backoffice/users').render('user.register').middleware(['admin'])
Route.on('backoffice/announcement').render('user.register').middleware(['admin'])
Route.on('backoffice/message').render('user.register').middleware(['admin'])
Route.on('backoffice/categoryBis').render('user.register').middleware(['admin'])
Route.on('backoffice/level').render('user.register').middleware(['admin'])