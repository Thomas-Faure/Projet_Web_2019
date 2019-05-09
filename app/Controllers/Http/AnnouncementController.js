'use strict'
const Announcement = use('App/Models/Announcement')
const Announcement_Category = use('App/Models/Category')
const Database = use('Database')


class AnnouncementController {
    async destroy ({ params, request, response }) {
    }

    async edit ({ params, request, response, view }) {
    }

    async show ({ params, request, response, view }) {
        const announcement = await Announcement.find(params.id)
        if(announcement){
            /*var date = new Date(user.birthday),
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
            user.birthday= [ day, mnth, date.getFullYear() ].join("-");*/
            return view.render('announcement.profile')
        }else{
            return response.redirect('back')
        }
    }

    async store({request, auth, response, session}) {
        try{
            const name_announcement = request.input("name_announcement")
            const description = request.input("description")
            const category_id = request.input("category_id")
            const categoryExist = await Announcement_Category.find(category_id)
            if(categoryExist){
                let announcement = new Announcement()
                announcement.name_announcement = name_announcement
                announcement.description = description
                announcement.category_id = category_id
                announcement.user_id = (await auth.getUser()).id //pour récuperer l'id de l'utilisateur connecté
                await announcement.save()

                // Quand on a ajouté une nouvelle annonce, l'utilisateur gagne 1 d'experience
                const user = await auth.getUser()
                if(user.exp >= (user.niveau_id*10)-1){ //si l'experience = 9, on augmente de niveau
                    user.exp = 0
                    user.niveau_id=user.niveau_id+1;
                }else{
                    user.exp = user.exp+1
                }
                user.save()
                
                response.redirect('/page/1')
            }else{
                throw 'error'
            }
        }catch(error){
            session.flash({AnnouncementAddError : 'Veuillez à ne pas trafiquer le formulaire ;)'});
            return response.redirect('/announcement/store')
        }

    }
    async create({view}){
        const category =  await Announcement_Category.all()
        
        return view.render('announcement.store',{categorys : category.toJSON()})
    }



}

module.exports = AnnouncementController
