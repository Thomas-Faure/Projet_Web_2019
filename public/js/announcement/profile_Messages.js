var message_color = 0; //couleur du message 
var page_actuel = 1; //page actuel
var max_page = 5; //max de message par page
var objJson; //tableau qui va contenir les messages
var idAnnouncement = 0; //id de l'annonce 
var user_announcement_creator_id = 0; //id de l'utilisateur créateur de l'annonce
var token = 0; //token CSRF
var userVisitorID = 0; //id du visiteur actuellement en train d'être sur la page
var administrator = 0; //1 si administrateur , 0 sinon

//permet de récuperer les messages d'une annonce dont l'id est passé en paramètre
//le tocken est également en paramètre
//l'id de l'utlisateur créateur de l'annonce y est aussi
//l'id de l'utlisateur visiteur de la page
//et un paramètre admin (1 ou 0), PS: si on s'amuse à changer ce 0 en 1 , rien ne change vu que c'est géré dans le backend//
//ce paramètre administrateur ne sert uniquement à afficher la poubelle de suppression de message/Annonce
function getMessages(id, token_temp, idUser, visitorID, admin) {
    administrator = admin
    user_announcement_creator_id = idUser
    token = token_temp
    idAnnouncement = id;
    userVisitorID = visitorID;
    var xhr = new XMLHttpRequest();
    //pour récuperer tout les messages d'une annonce
    xhr.open('GET', '/announcement/' + idAnnouncement + '/messages');
    xhr.onload = function () {
        if (xhr.status === 200) {

            let value = JSON.parse(xhr.responseText);
            objJson = value.valeur;
            changePage(1);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}


//permet d'affecter une couleur
function setMessageColor(color) {
    message_color = color;
}

//fonction de changement de page propre aux messages (cette fonction reviens dans les autres fichiers .js mais le résultat n'est pas le même)
//en paramètre un integer représentant la page souhaité
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
            let date_converted = date_converter(objJson[i].created_at)

            listing_table.innerHTML += '<div class="row message-container" id="div-message-' + objJson[i].id_message + '" style="padding-bottom:20px;">' +
                '        <div class="col-2"></div>' +
                '        <div class="col-8">' +
                '            <div class="message-div" style="background:' + objJson[i].color + '">' +
                '                    <a class="message-username" href="/user/' + objJson[i].user_id + '"><p> <img class="message-username-img" src="/img/icon.png" />' + ((objJson[i].admin == 1) ? '<span > 👑 </span>' : "") + objJson[i].username + ((user_announcement_creator_id == objJson[i].user_id) ? '<span> ⭐ </span>' : "") + '</p></a>' +
                '                    <div class="message-msg"><p>' + objJson[i].name_message + '</p></div>' +
                '                    <p class="message-note">' +
                '                            <a onClick="decrementValueM(' + objJson[i].id_message + ',' + i + ',\'' + token + '\')"><i class="fas fa-minus-square message-note-el"></i></a>' +
                '                            <span class="message-note-el" id="' + objJson[i].id_message + '_message">' + objJson[i].note + '</span>' +
                '                            <a onClick="incrementValueM(' + objJson[i].id_message + ',\'' + token + '\')"><i class="fas fa-plus-square message-note-el"></i></a></p>' +
                '                            ' + (((objJson[i].user_id == userVisitorID) || administrator == 1) ? '<div class="message-delete"><a class="btn btn-warning" onclick="delete_message(' + objJson[i].id_message + ',' + i + ')" role="button"><i class="fas fa-trash"></i></a></div>     ' : "") +
                '                            <div class="message-date">' +
                '                                    ' + date_converted +
                '                                </div>     ' +
                '            </div>' +
                '        </div>' +
                '        <div class="col-2"></div>' +
                '' +
                '    </div>';
        }
    } else {
        listing_table.innerHTML = '<p class="aucune-annonce">aucun message</p>';
    }
    page_span.innerHTML = page + "/" + numPages();


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


//id = id du visiteur, elid est l'id de l'élement du tableau comportant les messages 
function delete_message(id, elid) {
    var resultat = "";
    var result = confirm("Vous confirmez la suppression ?");
    if (result) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/message/' + id + '/delete');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader("x-csrf-token", token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let value = JSON.parse(xhr.responseText);
                resultat = value.valeur;
                if (resultat == "supprimé") {
                    var elem = document.getElementById("div-message-" + id);
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

//permet de supprimer une annonce dont l'id est placé en paramètre
//une verification en backend permet d'autoriser la suppression
function delete_announcement(id) {
    var resultat = "";
    var result = confirm("Vous confirmez la suppression ?");
    if (result) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/announcement/' + id + '/delete');
        xhr.setRequestHeader("x-csrf-token", token);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = function () {
            if (xhr.status === 200) {
                let value = JSON.parse(xhr.responseText);
                resultat = value.valeur;
                if (resultat == "supprimé") {
                    window.location.href = "/announcement/category/all";
                }

            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

    }
}

//fonction qui permet à un utilsateur de poster un message dans l'annonce actuellement visité
//id correspond au créateur de l'annonce
//token correspond au token CSRF
//id_annoncement correspond à l'id de l'annonce
//auth_id correspond à l'identifiant de l'utilsateur visitant actuellement la page
function postMessage(id, token, id_announcement, auth_id) {
    var form = document.getElementById('form-message');
    var FD = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/message/store/announcement/' + id);

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = function () {
        if (xhr.status === 200) {
            let value = JSON.parse(xhr.responseText);
            if (value.result == true) {
                document.getElementById('message-error-field').innerHTML = '';
                document.getElementById("name_message").value = '';
                getMessages(id, token, id_announcement, auth_id, administrator)
            } else {
                document.getElementById('message-error-field').innerHTML = '<div class="form-error-general">' +
                    '<span>' +
                    '<i class="fas fa-exclamation-triangle"></i>' +value.returnMessage+
                    '</span>' +
                    '</div>';
            }

        }

    };
    xhr.send(FD);//envoi le formulaire 
}