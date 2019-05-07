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

Route.on('/').render('index');



//pour déconnecter un utilisateur
Route.get('user/logout', 'UserController.logout');

//chemin pour la connexion utilisateur
Route.on('user/login').render('user.login').middleware(['guest'])
Route.post('user/login','UserController.login').validator('LogUser');




//chemin pour l'inscription utilisateur
Route.on('user/register').render('user.register').middleware(['guest'])
Route.post('user/register','UserController.register').validator('RegisterUser');
