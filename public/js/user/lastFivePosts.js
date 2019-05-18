function getAnnouncements(id_user,token) {
    var objJson;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/user/' + id_user + '/getFiveLastAnnouncements'); //GET sur les annonces d'un utilisateur
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = function () {
        if (xhr.status === 200) {

            let value = JSON.parse(xhr.responseText);
            objJson = value.valeur;
            for(var i =0;i< objJson.length;++i){
                    let date_converted = date_converter(objJson[i].created_at);
                    document.getElementById('5last').innerHTML += '<a href="/announcement/'+objJson[i].id+'" style="text-decoration: none">'+
      '<div class="annonce-container" style="background: '+objJson[i].color+'">'+
        '<div class="blank">'+
            '<img alt="image_annonce" class="announcement-img" src="/img/'+objJson[i].image+'" />'+
        '</div>'+
        '<div>'+
         '<p><span id="user-profile-announcement-username">'+objJson[i].username+' (note: '+objJson[i].note+')</span></p>'+
          '<p id="user-profile-announcement-name">'+objJson[i].name_announcement+'</p>'+
          '<p style="font-size: 12px;color:black">'+date_converted+'</p>'+
        '</div>'+
    '</div>'+
  '</a>'
            }
            if(objJson.length == 0){
                document.getElementById('5last').innerHTML += '<h1 style="text-align:center">Aucune annonce</h1>'
            }
            
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}