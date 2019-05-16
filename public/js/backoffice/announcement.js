var token = 0
function setToken(token_temp) {
    token = token_temp
}
var objJson;
function delete_id(id) {
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
function setData(data) {

    document.getElementById('data-backoffice').innerHTML = ""


    for (var i = 0; i < data.length; ++i) {
        document.getElementById('data-backoffice').innerHTML += '<tr id="' + data[i].id_announcement + '_row"><td>' + data[i].id_announcement + '</td><td>' + data[i].name_announcement + '</td><td><a class="btn btn-danger button-bo" onClick="delete_id(' + data[i].id_announcement + ')" role="button"><i class="fas fa-trash-alt"></i></a> <a class="btn btn-info button-bo" href="/announcement/' + data[i].id_announcement + '/edit" role="button"><i class="fas fa-cog"></i></a> <a class="btn btn-info button-bo" href="/backoffice/announcement/' + data[i].id_announcement + '/messages" role="button">Messages</a></td></tr>';
    }
    var myTable = document.querySelector("table");
    var dataTable = new DataTable(myTable);
}
var xhr = new XMLHttpRequest();
xhr.open('GET', '/announcement');
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