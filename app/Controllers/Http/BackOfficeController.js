'use strict'
const User = use('App/Models/User')
const Database = use('Database')


class BackOfficeController {
    async index ({ view }) {
       
        return view.render('backoffice.index')
    }

    

  

    

    


    

    
    

   
}

module.exports = BackOfficeController
