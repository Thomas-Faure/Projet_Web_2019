var page_actuel = 1;
var max_page = 5;
var objJson;
var id_user = 0;
var xhr = new XMLHttpRequest();
token = 0;
var admin = false;

//permet de récuperer toutes les annonces d'un utilisateur dont l'id est en paramètre
//le token CSRF est également en paramètre
function getAnnouncements(id, token_temp,admin_temp) {
    id_user = id
    admin = admin_temp
    token = token_temp
    xhr.open('GET', '/user/' + id_user + '/getAnnouncements'); //GET sur les annonces d'un utilisateur
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = function () {
        if (xhr.status === 200) {

            let value = JSON.parse(xhr.responseText);
            objJson = value.valeur;
            if (objJson.length > 0) {
                changePage(1);
            } else {
                document.getElementById("listingTable").innerHTML = '<p class="aucune-annonce">aucune annonce</p>'
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}


//fonction qui permet de changer de page
function changePage(page) {
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

    
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";
    if (objJson.length > 0) {
        for (var i = (page - 1) * max_page; i < (page * max_page) && i < objJson.length; i++) {

            if (objJson[i] != "null") {


                let date_converted = date_converter(objJson[i].created_at)

                listing_table.innerHTML += '<div id="' + objJson[i].id_announcement + '_row"><div class ="card-style">'+(admin == true ? 'Action:  <a class="btn btn-danger" onclick="delete_id(' + objJson[i].id_announcement + ',' + i + ')"role="button"><i class="fas fa-trash-alt"></i></a>  <a href="/announcement/' + objJson[i].id_announcement + '/edit"class="btn btn-info" role="button"><i class="fas fa-cog"></i></a>': 'Annonce : '+i)+'</div><a href="/announcement/' + objJson[i].id_announcement + '" style="text-decoration: none">'+
                    '      <div class="annonce-container" style="background: ' + objJson[i].color + '">' +
                    '        <div class="blank">' +
                    '            <img alt="image_annonce" class="announcement-img" src="/img/' + objJson[i].image + '" />' +
                    '        </div>' +
                    '        <div class="announce-index-content">' +
                    '        <p><span class="announce-index-username" >' + objJson[i].username + ' ( note: <span style="color:black">' + objJson[i].note + '</span>)</span></p>' +
                    '          <p class="announce-index-name" >' + objJson[i].name_announcement + '</p>' +
                    '          <p class="announce-index-date" >' + date_converted + '</p>' +
                    '        </div>' +
                    '    </div>' +
                    '  </a></div>'
                    ;
            }
        }
    } else {
        listing_table.innerHTML = '<p class="aucune-annonce">aucune annonce</p>';
    }
    page_span.innerHTML = page;

    if (page == 1) {
        btn_prev.disabled = true;
    } else {
        btn_prev.disabled = false;;
    }

    if (page == numPages()) {
        btn_next.disabled = true;
    } else {
        btn_next.disabled = false;
    }
}


//fonction de suppression d'un element dans un tableau
function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });

}

//fonction qui permet de supprimer une annonce
//contient l'id de l'élement à supprimer en paramètre
//elid correspond à l'index de l'element à supprimer (index dans le tableau d'objet JSON)
function delete_id(id, elid) {
    var result = confirm("Vous confirmez la suppression ?");
    if (result) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/announcement/' + id + '/delete');
        xhr.setRequestHeader("x-csrf-token", token);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = function () {
            if (xhr.status === 200) {
                let value = JSON.parse(xhr.responseText);
                result = value.valeur;

                if (result == true ||result == false) {
                    var elem = document.getElementById(+id + "_row");
                    elem.parentNode.removeChild(elem);
                    objJson = arrayRemove(objJson, objJson[elid])
                    changePage(page_actuel);
                }

            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

    }
}