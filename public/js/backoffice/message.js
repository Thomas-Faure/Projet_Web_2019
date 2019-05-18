
var objJson; //tableau de messages
var token = 0
var id = 0;
function setTokenAndId(token_temp, id_temp) {
    token = token_temp
    id = id_temp
}


//permet de supprimer un message dont l'id est placé en paramètre
function delete_id(id) {
    var result = confirm("Vous confirmez la suppression ?");
    if (result) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/message/' + id + '/delete');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader("x-csrf-token", token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let value = JSON.parse(xhr.responseText);
                result = value.valeur;

                if (result == true) {
                    var elem = document.getElementById(+id + "_row");
                    elem.parentNode.removeChild(elem);
                }
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

    }
}

//permet de ranger dans le tableau HTML tout les element du tableau de niveaux
function setData(data) {

    document.getElementById('data-backoffice').innerHTML = ""


    for (var i = 0; i < data.length; ++i) {
        if ((data[i].name_message).length > 18) {
            data[i].name_message = data[i].name_message.substr(0, 15) + '...';
        }
        document.getElementById('data-backoffice').innerHTML += '<tr id="' + data[i].id_message + '_row"><td>' + data[i].id_message + '</td><td>' + (data[i].name_message) + '</td><td>' + data[i].username + '</td><td><a class="btn btn-info button-bo" href="/message/' + data[i].id_message + '/edit" role="button"><i class="fas fa-cog"></i></a> <a class="btn btn-danger" onClick="delete_id(' + data[i].id_message + ')" role="button">Supprimer</a></td></tr>';
    }
    var myTable = document.querySelector("table");
    var dataTable = new DataTable(myTable);
}

//permet de récuperer tout les messages qui ont été posté
function getMessages() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/announcement/' + id + '/messages');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = function () {
        if (xhr.status === 200) {
            let value = JSON.parse(xhr.responseText);
            objJson = value.valeur;

            setData(objJson);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

// or

