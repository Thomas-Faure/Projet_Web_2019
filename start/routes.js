'use strict'
const Announcement_Category = use('App/Models/Category')
const User = use('App/Models/User')
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
Route.get('ranking','IndexController.ranking').middleware(['auth'])

/**                    ERROR                                               */

/**                 PARTIE UTILISATEUR                                     */


//pour déconnecter un utilisateur


//chemin pour la connexion utilisateur


Route
  .group(() => {
    Route.get('','UserController.index').middleware(['auth'])
    Route.on('login').render('user.login').middleware(['guest'])
    Route.post('login','UserController.login').validator('LogUser');

    Route.get(':id/edit','UserController.edit').middleware(['auth'])
    Route.put(':id/edit','UserController.update').validator('EditUser');
    Route.get(':id/getannouncements','UserController.getAnnouncements').middleware(['auth'])
    Route.get(':id/announcements','UserController.announcements').middleware(['auth'])
    Route.get(':id/participation/:cat',async ({ view,params,response,auth }) => {
      
      const user_find = await User.find(params.id)
      if(user_find){
        if(!(params.cat=="all" || (await Announcement_Category.find(params.cat)))){
          response.redirect('/'+params.id+'/participation/all')
        }
        const categorys = await Announcement_Category.all()
        
        return view.render('user.participation',{id: params.id,cat: params.cat,categorys: categorys.toJSON()})
      }
    })

   // Route.get(':id/participation/:cat','AnnouncementController.index_category')
    Route.delete(':id/delete','UserController.destroy').middleware(['admin'])

    Route.on('register').render('user.register').middleware(['guest'])
    Route.post('register','UserController.store').validator('RegisterUser');

    Route.get('logout', 'UserController.logout').middleware(['auth'])
    Route.get(':id','UserController.show')
    
  })
  .prefix('user')



/**                 PARTIE BADGE                                     */



/**                 PARTIE NIVEAU                                     */

Route
  .group(() => {
    Route.get('','NiveauController.index').middleware(['auth'])
    Route.get(':id/edit','NiveauController.edit').middleware(['admin'])
    Route.put(':id/edit','NiveauController.update').validator('EditLevel').middleware(['admin'])

    Route.on('store').render('level.store').middleware(['admin'])
    Route.post('store','NiveauController.store').validator('AddLevel').middleware(['admin'])
  })
  .prefix('level')



/**                 PARTIE announcement                                 */
Route
  .group(() => {
    //Route.on('/category/all').render('announcement.index').middleware(['auth'])
    Route.get('','AnnouncementController.index')

    Route.get('category/:id',async ({ view,params,response }) => {
      if(!(params.id=="all" || (await Announcement_Category.find(params.id)))){
        response.redirect('/announcement/category/all')
      }
        const categorys = await Announcement_Category.all()
      
      return view.render('announcement.index',{id: params.id,categorys: categorys.toJSON()})
    })
    Route.get('category/get/:id','AnnouncementController.index_category')
    Route.get('store','AnnouncementController.create').middleware(['auth'])
    Route.post('store','AnnouncementController.store').validator('AddAnnouncement');
    Route.get('user/:id','AnnouncementController.getUserAnnounces')
    Route.get('user/:id/category/:cat','AnnouncementController.getUserAnnounces_category')
    Route.post('increment','AnnouncementController.increment').middleware(['auth'])
    Route.post('decrement','AnnouncementController.decrement').middleware(['auth'])
    Route.get('last','AnnouncementController.getLastAnnouncement')
    Route.get(':id/vote','AnnouncementController.vote').middleware(['auth'])
    Route.get(':id/messages','AnnouncementController.getMessages')

    Route.delete(':id/delete','AnnouncementController.destroy').middleware(['auth'])
    Route.get(':id','AnnouncementController.show')
    
  })
  .prefix('announcement')




/**                 PARTIE MESSAGE                                     */
Route
  .group(() => {
    Route.delete(':id/delete','MessageController.destroy').middleware(['auth'])
    Route.get('store/announcement/:id','MessageController.create').middleware(['auth'])
    Route.post('store/announcement/:id','MessageController.store').validator('AddMessage')
    Route.post('increment','MessageController.increment').middleware(['auth'])
    Route.post('decrement','MessageController.decrement').middleware(['auth'])
    Route.get(':id/vote','MessageController.vote').middleware(['auth'])
  })
  .prefix('message')
/**                 PARTIE CATEGORY_QUESTION                                     */

Route
  .group(() => {
    Route.get('','CategoryAnnouncementController.index').middleware(['auth'])
    Route.get(':id/edit','CategoryAnnouncementController.edit').middleware(['admin'])
    Route.put(':id/edit','CategoryAnnouncementController.update').middleware(['admin'])

    Route.on('store').render('category.store').middleware(['admin'])
    Route.post('store','CategoryAnnouncementController.store').middleware(['admin']).validator('AddCategory')

  })
  .prefix('category')

/**                 PARTIE BACKOFFICE                                     */

//page accueil admin
Route.get('backoffice','BackOfficeController.index').middleware(['admin'])
Route.on('backoffice/users').render('backoffice.users').middleware(['admin'])
Route.get('backoffice/announcement/:id/messages','BackofficeController.messages').middleware(['admin'])
Route.on('backoffice/announcement').render('backoffice.announcement').middleware(['admin'])
Route.on('backoffice/category').render('backoffice.category').middleware(['admin'])
Route.on('backoffice/level').render('backoffice.level').middleware(['admin'])




Route
  .group(() => {
    Route.on('401').render('error.401');
    Route.on('403').render('error.403');
    Route.on('404').render('error.404');
    Route.on('500').render('error.500');
  })
  .prefix('error')