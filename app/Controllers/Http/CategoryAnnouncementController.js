'use strict'

//les modèles
const Category = use('App/Models/Category')
const Helpers = use('Helpers')
const erreurPerso = use('App/Exceptions/CustomException')


class CategoryAnnouncementController {

    /**
     * 
     *  CREATE
     * 
     * Verb : POST
     *
    */

    //fonction qui permet de créer une nouvelle catégorie
    async store({ request, response, session, auth }) {
        try {
            const user = await auth.getUser()
            if (user.admin != 1) {
                throw 'error'
            }
            var format = /[<>]/;
            const name_category = request.input("name_category")
            if (format.test(name_category)) {
                session.flash({ addCategoryError: 'Contient des caractères non accepté' });
                return response.redirect('/category/store')
            }
            const color = request.input("color")
            let category = new Category()
            category.name_category = name_category
            category.color = color
            category.image = "default.png" //c'est une image par defaut
            let id = await category.save()
            if (request.file('image') != null) { //on a une image à mettre
                const file = request.file('image', {
                    types: ['image'],
                    size: '2mb'
                })
                const fileName = 'cat' + category.id_category_announcement + "." + file.subtype;
                if (file != null) {
                    await file.move(Helpers.publicPath('img/'), {
                        name: fileName,
                        overwrite: true
                    })

                    if (!file.moved()) {
                        session.flash({ addCategoryError: 'Inserer, mais:  Erreur, le fichier n\'est pas un image' });
                        return response.redirect('/category/store')
                    }
                    category.image = fileName;
                    await category.save();

                }

            }
            response.redirect('/backoffice/category')

        } catch (error) {
            console.log(error)
            session.flash({ addCategoryError: 'Impossible d\'ajouter une categorie' });
            return response.redirect('/category/store')

        }

    }



    /**
    * 
    *  READ
    * 
    * Verb : GET
    *
    */

    //récupère les informations d'une catégorie , génère la vue de modification de catégorie
    async edit({ view, params, response }) {
        let category = (await Category.find(params.id))
        if (category) {

            return view.render('category.edit', { category: category })
        } else {
            try {
                throw 'error'
            } catch (e) {
                throw new erreurPerso("Not found", 404, "E_ROUTE")
            }
        }
    }
    //permet de récuperer toutes les catégories
    async index({ request, response }) {
        if (request.ajax()) {
            const categorys = await Category.all()
            return response.json({
                valeur: categorys.toJSON()
            }
            );
        } else {
            try {
                throw 'error'
            } catch (e) {
                throw new erreurPerso("Forbiden", 403, "E_FORBIDEN")
            }
        }
    }



    /**
    * 
    *  UPDATE
    * 
    * Verb : PUT
    *
    */

    //permet de mettre à jour une catégorie
    async update({ params, request, response }) {
        var format = /[<>]/;
        const name_category = request.input('name_category')
        const color = request.input('color')
        const image_check = request.input('image_check')
        if (format.test(name_category)) {
            session.flash({ addCategoryError: 'Contient des caractères non acceptés' });
            return response.redirect('/category/'+params.id+'/edit')
        }
        let category = await Category.find(params.id)
        if (category) {
            category.name_category = name_category
            category.color = color

            if (image_check != null) {//on demande de supprimer l'image
                if (category.image != "default.png") {
                    const fs = Helpers.promisify(require('fs'))
                    await fs.unlink('public/img/' + category.image)

                    category.image = "default.png"
                }
            }

            if (request.file('image') != null) { //on a une image à mettre
                const file = request.file('image', {
                    types: ['image'],
                    size: '2mb'
                })
                const fileName = 'cat' + category.id_category_announcement + "." + file.subtype;
                if (file != null) {
                    await file.move(Helpers.publicPath('img/'), {
                        name: fileName,
                        overwrite: true
                    })

                    if (!file.moved()) {
                        session.flash({ addCategoryError: 'Inseré, mais:  Erreur, le fichier n\'est pas une image' });
                        return response.redirect('/category/'+params.id+'/edit')
                    }
                    category.image = fileName
                }
            }
            await category.save()
        }
        return response.redirect('/backoffice/category')
    }


    /**
    * 
    *  DELETE
    * 
    * Verb : DELETE
    *
    */
    //permet de supprimer un message , l'id du message est en paramètre d'uri (params.id)
    async destroy({ params, response, auth }) {
        let resultat = "non supprimé"
        try {
            const user = await auth.getUser();
            const category = await Category.find(params.id)
            if (category) {
                if (user.admin == 1) {
                    resultat = "supprimé"
                    await category.delete()
                }
            } else { //l'annonce n'existe plus (cas ou une personne demande la suppression alors qu'une autre l'a demandé juste avant)
                if (user.admin == 1) {
                    resultat = "supprimé" //on dit donc à l'utlisateur qu'il peut supprimer de sa balise HTML l'element qui n'est donc plus existant
                }
            }
            return response.json({
                valeur: resultat

            })
        } catch (e) {
            console.log(e)
        }

    }
}

module.exports = CategoryAnnouncementController
