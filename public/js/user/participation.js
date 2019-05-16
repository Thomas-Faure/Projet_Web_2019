var page_actuel = 1; //page actuelle
var max_page = 5; //nombre d'element max par page
var objJson; //tableau d'annonces
var id_user = 0 //id de l'ulisateur
var id_cat = 0 //id de la catégorie

//permet de récuperer toutes les annonces d'un utilisateur (id) dans une catégorie d'annonce (cat)
function getParticipations(id, cat) {
    var id_user = id
    var id_cat = cat
    var xhr = new XMLHttpRequest();
    //pour récuperer tout les messages d'une annonce
    if (id_cat == "all") {
        xhr.open('GET', '/announcement/user/' + id_user);
    } else {
        xhr.open('GET', '/announcement/user/' + id_user + '/category/' + id_cat);
    }
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
                   

//permet de changer de page dans la pagination
function changePage(page) {
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

   
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page - 1) * max_page; i < (page * max_page) && i < objJson.length; i++) {


        let date = new Date(objJson[i].created_at)
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());
        let minute = String(date.getMinutes());
        let hour = String(date.getHours());
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (minute.length < 2) minute = '0' + minute;
        if (hour.length < 2) hour = '0' + hour;

        let date_converted = day + '/' + month + "/" + year + " " + hour + ":" + minute
        listing_table.innerHTML += '<a href="/announcement/' + objJson[i].id_announcement + '" style="text-decoration: none">' +
            '      <div class="annonce-container" style="background: ' + objJson[i].color + '">' +
            '        <div class="blank">' +
            '            <img src="/img/' + objJson[i].image + '" style="width: 100%;height:auto;"/>' +
            '        </div>' +
            '        <div class="announce-index-content">' +
            '        <p><span class="announce-index-username" >' + objJson[i].username + '(<span style="color:black">' + objJson[i].note + '</span>)</span></p>' +
            '          <p class="announce-index-name" >' + objJson[i].name_announcement + '</p>' +
            '          <p class="announce-index-date" >' + date_converted + '</p>' +
            '        </div>' +
            '    </div>' +
            '  </a>';




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
