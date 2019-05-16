var objJson; //tableau de catégories

var token = 0
function setToken(token_temp) {
    token = token_temp
}

//permet de placer le tableau de catégorie dans notre tableau html
function setData(data) {

    document.getElementById('data-backoffice').innerHTML = ""


    for (var i = 0; i < data.length; ++i) {
        document.getElementById('data-backoffice').innerHTML += '<tr id="' + data[i].id_category_announcement + '_row"><td>' + data[i].id_category_announcement + '</td><td>' + data[i].name_category + '</td><td><a class="btn btn-info button-bo" href="/category/' + data[i].id_category_announcement + '/edit" role="button"><i class="fas fa-cogs"></i></a></td></tr>';
    }
    var myTable = document.querySelector("table");
    var dataTable = new DataTable(myTable);
}
var xhr = new XMLHttpRequest();
xhr.open('GET', '/category');
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
