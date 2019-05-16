function prevPage() {
    if (page_actuel > 1) {
        page_actuel--;
        changePage(page_actuel);
    }
}
function nextPage() {
    if (page_actuel < numPages()) {
        page_actuel++;
        changePage(page_actuel);
    }

}


function numPages() {
    return Math.ceil(objJson.length / max_page);
}