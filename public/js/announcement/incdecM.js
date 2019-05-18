//permet d'enlever un element d'un tableau
function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}
//fonction qui permet de décrementer le vote pour un message, elle a en paramètre l'id du message à decrementer, elid qui correspond à l'index du message
//dans notre objet objJson (qui va permettre la suppression eventuel du message) ainsi que token qui est le token CSRF
function decrementValueM(id, elid, token) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/message/decrement');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("x-csrf-token", token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
            if(result.valeur==true){
                var xhr2 = new XMLHttpRequest();
                xhr2.open('GET', '/message/' + id + '/vote');
                xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr2.setRequestHeader("x-csrf-token", token);
                xhr2.onload = function () {
                    if (xhr2.status === 200) {
                        let value = JSON.parse(xhr2.responseText);
                        document.getElementById(id + '_message').innerHTML = value.valeur;
                        if (value.suppression == true) {
                            var elem = document.getElementById("div-message-" + id);
                            elem.parentNode.removeChild(elem);
                            objJson = arrayRemove(objJson, objJson[elid])

                            changePage(page_actuel);

                        }

                    }
                    
                };
                xhr2.send();
            }
        }

    };
    xhr.send("id=" + id);



};

//fonction qui permet d'incrementer le vote pour un message, elle a en paramètre l'id du message à incrementer, elid qui correspond à l'index du message
//dans notre objet objJson (qui va permettre la suppression eventuel du message) ainsi que token qui est le token CSRF
function incrementValueM(id, token) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/message/increment');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("x-csrf-token", token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
           
            if(result.valeur==true){
                var xhr2 = new XMLHttpRequest();
                xhr2.open('GET', '/message/' + id + '/vote');
                xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr2.setRequestHeader("x-csrf-token", token);
                xhr2.onload = function () {
                    if (xhr2.status === 200) {
                        let value = JSON.parse(xhr2.responseText);
                        document.getElementById(id + '_message').innerHTML = value.valeur;
                    } 
                };
                xhr2.send();
            }
        }
        
    };
    xhr.send("id=" + id);


}