var objJson; //est un tableau d'annonce
var lastPost = document.getElementById('last-post');
var xhr = new XMLHttpRequest();
xhr.open('GET', '/announcement/last'); //pour récuperer la dernière annonce
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload = function () {
    if (xhr.status === 200) {

        let objJson = JSON.parse(xhr.responseText);
        if (objJson != null) {


            let date_converted = date_converter(objJson.created_at)
            lastPost.innerHTML = '<a href="/announcement/' + objJson.id_announcement + '" style="text-decoration: none">' +
                '      <div class="annonce-container" style="background: ' + objJson.color + '">' +
                '        <div class="blank">' +
                '            <img class="announcement-img" src="/img/' + objJson.image + '" />' +
                '        </div>' +
                '        <div class="announce-index-content">' +
                '          <p class="announce-index-name"style="">' + objJson.name_announcement + '</p>' +
                '          <p class="announce-index-date" >' + date_converted + '</p>' +
                '        </div>' +
                '    </div>' +
                '  </a>';


        }
    }
    else {
        lastPost.innerHTML = "Il n'y a aucun poste pour le moment" //si la fonction ajax ne retourne rien, ca indique qu'aucune annonce a été posté
    }
};
xhr.send();