"use strict";

//fonction qui prend en paramètre un id correspondant à l'id de l'annonce, et un token correspondant à CSRF
function decrementValueA(id, token) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/announcement/decrement'); //on poste le decrement
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("x-csrf-token", token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', '/announcement/' + id + '/vote');
            xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr2.setRequestHeader("x-csrf-token", token);
            xhr2.onload = function () {
                if (xhr2.status === 200) {
                    let value = JSON.parse(xhr2.responseText);
                    document.getElementById(id + '_announcement').innerHTML = value.valeur;

                    if (value.suppression == true) {//si c'est supprimé on revient sur la page principale
                        window.location.href = "/announcement/category/all";
                    }
                }
                else {
                    alert('Request failed.  Returned status of ' + xhr2.status); //la requete n'a pas fonctionné
                }
            };
            xhr2.send();
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send("id=" + id);//on envoie l'id de l'annonce



};

//fonction qui permet d'incrementer le vote d'une annonce, elle a en paramètre l'id de l'annonce et le token CSRF
function incrementValueA(id, token) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/announcement/increment'); //on post sur cette route
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("x-csrf-token", token);
    xhr.onload = function () {
        if (xhr.status === 200) {

            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', '/announcement/' + id + '/vote');
            xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr2.setRequestHeader("x-csrf-token", token);
            xhr2.onload = function () {
                if (xhr2.status === 200) {
                    let value = JSON.parse(xhr2.responseText);
                    document.getElementById(id + '_announcement').innerHTML = value.valeur;
                }
                else {
                    alert('Request failed.  Returned status of ' + xhr2.status);
                }
            };
            xhr2.send();
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send("id=" + id);//on envoie l'id de l'annonce


}