'use strict'

const Env = use('Env');

class AjaxController{

    async getData({response}) {
        
        return response.json({
            appName: Env.get('APP_NAME')
        });
    }
}
//$.getJSON('/ajax/getData', data => console.log(data));
module.exports = AjaxController