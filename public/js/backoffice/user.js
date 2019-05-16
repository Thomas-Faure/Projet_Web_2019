var objJson; //tableau d'utlisateurs
var token
function setToken(token_temp) {
    token = token_temp
}

//permet de supprimer un utilisateur
//l'id de l'utlilisateur à supprimé est le paramètre
function delete_id(id) {
    var resultat = "";
    var result = confirm("Vous confirmez la suppression ?");
    if (result) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/user/' + id + '/delete');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader("x-csrf-token", token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let value = JSON.parse(xhr.responseText);
                resultat = value.valeur;
                if (resultat == "supprimé") {
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

//permet de placer tout les éléments du tableau d'utilisateurs dans le tableau HTML
function setData(data) {

    document.getElementById('data-backoffice').innerHTML = ""
    for (var i = 0; i < data.length; ++i) {
        document.getElementById('data-backoffice').innerHTML += '<tr id="' + data[i].id + '_row"><td>' + data[i].id + '</td><td>' + data[i].username + '</td><td><a class="btn btn-info button-bo" href="/user/' + data[i].id + '/edit" role="button"><i class="fas fa-cogs"></i></a> <a class="btn btn-danger button-bo" onClick="delete_id(' + data[i].id + ')" role="button"><i class="fas fa-trash-alt"></i></a></td></tr>';
    }
    var myTable = document.querySelector("table");
    var dataTable = new DataTable(myTable);
}


//permet de récuperer tout les utlisateurs
function getUsers() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/user');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = function () {
        if (xhr.status === 200) {
            let value = JSON.parse(xhr.responseText);
            objJson = value;

            setData(objJson);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}
