var message_color = 0;
var page_actuel = 1;
var max_page = 5;
var objJson;
var idAnnouncement = 0;
var user_announcement_creator_id = 0;
var token = 0;
var userVisitorID = 0;
var administrator = 0;
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

function setMessageColor(color) {
    message_color = color;
}
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


//id = id du visiteur, elid est l'idée de l'élement objet c'est à dire un numéro correspondant à un index du tableau objJson
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
                    '<i class="fas fa-exclamation-triangle"></i>Vous devez attendre avant denvoyer un nouveau message' +
                    '</span>' +
                    '</div>';
            }

        }

    };
    xhr.send(FD);
}