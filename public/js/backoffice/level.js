var objJson; //tableau de niveaux

var token = 0
function setToken(token_temp) {
    token = token_temp
}


//permet de placer tout le tableau de niveau dans un tableau HTML
function setData(data) {

    document.getElementById('data-backoffice').innerHTML = ""


    for (var i = 0; i < data.length; ++i) {
        document.getElementById('data-backoffice').innerHTML += '<tr id="' + data[i].id_level + '_row"><td>' + data[i].id_level + '</td><td>' + data[i].name + '</td><td><a class="btn btn-info" href="/level/' + data[i].id_level + '/edit" role="button"><i class="fas fa-cogs"></i></a></td></tr>';
    }
    var myTable = document.querySelector("table");
    var dataTable = new DataTable(myTable);
}
var xhr = new XMLHttpRequest();
xhr.open('GET', '/level');
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


