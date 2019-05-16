var objJson;
var lastPost = document.getElementById('last-post');
var xhr = new XMLHttpRequest();
xhr.open('GET', '/announcement/last');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload = function () {
    if (xhr.status === 200) {

        let objJson = JSON.parse(xhr.responseText);
        if (objJson != null) {
            let date = new Date(objJson.created_at)
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
            lastPost.innerHTML = '<a href="/announcement/' + objJson.id_announcement + '" style="text-decoration: none">' +
                '      <div class="annonce-container" style="background: ' + objJson.color + '">' +
                '        <div class="blank">' +
                '            <img src="/img/' + objJson.image + '" style="width: 100%;height:auto;"/>' +
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
        lastPost.innerHTML = "Il n'y a aucun poste pour le moment"
    }
};
xhr.send();