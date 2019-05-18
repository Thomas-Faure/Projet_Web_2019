var token = 0 //id du token CSRF

//permet d'initiliser la variable token
function setToken(token_temp) {
    token = token_temp
}

var objJson; //tableau d'annonce

//fonction qui permet de supprimer une annonce via une requete ajax
//id de l'annonce est en paramètre
function delete_id(id) {
    var result = confirm("Vous confirmez la suppression ?");
    if (result) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/announcement/' + id + '/delete'); //suppression en DELETE
        xhr.setRequestHeader("x-csrf-token", token);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = function () {
            if (xhr.status === 200) {
                let value = JSON.parse(xhr.responseText);
                result = value.valeur;

                if (result == true ||result == false) { //double verification
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

//fonction qui permet de placer des elements dans un tableau appelé myTable
//DataTable est une bibliothèque qui permet de génerer un tableau automatiquement, qui rend l'administration plus pratique
//data est un tableau d'objets (contient ici toutes les annonces sous format JSON)
function setData(data) {

    document.getElementById('data-backoffice').innerHTML = ""


    for (var i = 0; i < data.length; ++i) {
        document.getElementById('data-backoffice').innerHTML += '<tr id="' + data[i].id_announcement + '_row"><td>' + data[i].id_announcement + '</td><td>' + data[i].name_announcement + '</td><td><a class="btn btn-danger button-bo" onClick="delete_id(' + data[i].id_announcement + ')" role="button"><i class="fas fa-trash-alt"></i></a> <a class="btn btn-info button-bo" href="/announcement/' + data[i].id_announcement + '/edit" role="button"><i class="fas fa-cog"></i></a> <a class="btn btn-info button-bo" href="/backoffice/announcement/' + data[i].id_announcement + '/messages" role="button">Messages</a></td></tr>';
    }
    var myTable = document.querySelector("table");
    var dataTable = new DataTable(myTable);
}
var xhr = new XMLHttpRequest();
xhr.open('GET', '/announcement'); //recupère toutes les annonces (de la semaine)
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