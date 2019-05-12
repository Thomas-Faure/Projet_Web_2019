'use strict'
const Category = use('App/Models/Category')
const Database = use('Database')
const Helpers = use('Helpers')



class CategoryAnnouncementController {
    async destroy ({ params, request, response }) {
    }


    async update ({ params, request, response }) {
        const name_category = request.input('name_category')
        const color = request.input('color')
        const image_check = request.input('image_check')
        let category = await Category.find(params.id)
        if(category){
        category.name_category = name_category
        category.color = color

        if(image_check != null){//on demande de supprimer l'image
            if(category.image !="default.png"){
            const fs = Helpers.promisify(require('fs'))
            await fs.unlink('public/img/'+category.image)
            category.image="default.png"
            }

        }
        category.save()
        if(request.file('image') != null){ //on a une image à mettre
            const file = request.file('image', {
                types: ['image'],
                size: '2mb'
              })
        const fileName = 'cat'+category.id_category_announcement +"."+file.subtype;
        if (file !=null){
            await file.move(Helpers.publicPath('img/'), {
                name: fileName,
                overwrite: true
            })
            
            if (!file.moved()) {
                session.flash({addCategoryError : 'Inserer, mais:  Erreur, le fichier n\'est pas un image'});
                return response.redirect('/category/store')
            }
            category.image = fileName;
            await category.save();
            
        }

        }
        }
        return response.redirect('/backoffice/category')

    }

    async edit ({ auth, view,params,response }) {
            let category = (await Category.find(params.id))
            if(category){
           
                return view.render('category.edit',{category : category})
            }else{
                response.redirect('back')
            }
     
        
    }

    async index ({ params, request, response, view }) {
        if (request.ajax()) {
            
            const categorys =  await Category.all()
            return response.json({
                valeur : categorys.toJSON()
            }
            );
        }else{
            response.redirect('/')
        }
    }

  

    async store({request, auth, response, session}) {
        try{
        const name_category = request.input("name_category")
        const color = request.input("color")
        let category = new Category()
        category.name_category = name_category
        category.color = color
        category.image = "default.png" //c'est une image par defaut

        let id = await category.save()
        if(request.file('image') != null){ //on a une image à mettre
            const file = request.file('image', {
                types: ['image'],
                size: '2mb'
              })
        const fileName = 'cat'+category.id_category_announcement +"."+file.subtype;
        if (file !=null){
            await file.move(Helpers.publicPath('img/'), {
                name: fileName,
                overwrite: true
            })
            
            if (!file.moved()) {
                session.flash({addCategoryError : 'Inserer, mais:  Erreur, le fichier n\'est pas un image'});
                return response.redirect('/category/store')
            }
            category.image = fileName;
            await category.save();
            
        }

        }
        response.redirect('/backoffice')

        }catch(error){
            console.log(error)
            session.flash({addCategoryError : 'Impossible d\'ajouter une categorie'});
                return response.redirect('/category/store')

        }
        
    }



}

module.exports = CategoryAnnouncementController
