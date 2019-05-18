var page_actuel = 1; //pâge de base
var max_page = 5; //nombre d'annonce par page
var objJson; //tableau d'objets
var xhr = new XMLHttpRequest(); //requete ajax

//fonction qui va récuperer les annonces via une requete Ajax (vanilla)
//le paramètre id correspond à "all" ou "id catégorie" permet de selectionner soit toutes les annonces soit une catégorie d'annonce
function getAnnounces(id) {
    //pour récuperer tout les messages d'une annonce
    if (id == "all") {
        xhr.open('GET', '/announcement');
    }
    else {
        xhr.open('GET', '/announcement/category/get/' + id);
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

//fonction qui permet de changer de page
//le paramètre est le numéro de page souhaité (à afficher)
function changePage(page) {
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

    //permet de ne pas tomber à 0
    if (page < 1) page = 1;
    //permet de ne pas depasser le nombre page max
    if (page > numPages()) page = numPages();

    //initialise l'element qui va recevoir les annonces
    listing_table.innerHTML = "";

    for (var i = (page - 1) * max_page; i < (page * max_page) && i < objJson.length; i++) {

        let date_converted = date_converter(objJson[i].created_at);
        listing_table.innerHTML += '<a href="/announcement/' + objJson[i].id_announcement + '" style="text-decoration: none"><div class ="card-style"><span class="announce-index-username" >Par: ' + objJson[i].username + '</span></div>' +
            '      <div class="annonce-container" style="background: ' + objJson[i].color + '">' +
            '        <div class="blank">' +
            '            <img alt="image_annonce" class="announcement-img" src="/img/' + objJson[i].image + '"/>' +
            '        </div>' +
            '        <div class="announce-index-content">' +
            '          <p>Note actuel : <span style="color:black">' + objJson[i].note + '</span></p>' +
            '          <p class="announce-index-name" >' + objJson[i].name_announcement + '</p>' +
            '          <p class="announce-index-date" >' + date_converted + '</p>' +
            '        </div>' +
            '    </div>' +
            '  </a>';

    }
    //permet d'afficher la page actuel
    page_span.innerHTML = page + "/" + numPages();

    //permet d'autoriser un clique sur les boutons précedent/suivant du système de pagination
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





