//permet de revenir sur la page précedente
function prevPage() {
    if (page_actuel > 1) {
        page_actuel--;
        changePage(page_actuel);
    }
}
//permet d'aller sur la page suivante
function nextPage() {
    if (page_actuel < numPages()) {
        page_actuel++;
        changePage(page_actuel);
    }

}

//permet de calculer le nombre de page en fonction du nombre d'objet présent dans la liste d'objet JSON
function numPages() {
    return Math.ceil(objJson.length / max_page);
}