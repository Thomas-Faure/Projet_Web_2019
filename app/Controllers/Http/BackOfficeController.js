'use strict'
const User = use('App/Models/User')
const Database = use('Database')


class BackOfficeController {
    async index ({ view }) {
       
        return view.render('backoffice.index')
    }


    async messages({view,params}){
        

        return view.render('backoffice.message',{id : params.id})
    }

    

  

    

    


    

    
    

   
}

module.exports = BackOfficeController
