var page_actuel = 1;
var max_page = 5;
var objJson;
var xhr = new XMLHttpRequest();
function getAnnounces(id){
//pour récuperer tout les messages d'une annonce
if(id=="all"){
xhr.open('GET', '/announcement');
}
else{
xhr.open('GET', '/announcement/category/get/'+id); 
}
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        xhr.onload = function() {
                            if (xhr.status === 200) {
                                
                               let value = JSON.parse(xhr.responseText);
                                objJson = value.valeur;
                                if(objJson.length >0){
                         
                                changePage(1);
                                }else{
                                    document.getElementById("listingTable").innerHTML='<p class="aucune-annonce">aucune annonce</p>'
                                }
                            }
                            else {
                                alert('Request failed.  Returned status of ' + xhr.status);
                            }
                        };
                        xhr.send();

                    }
                  

function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page-1) * max_page; i < (page * max_page) && i <objJson.length; i++) {

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

        let date_converted =  day+'/'+month+"/"+year+" "+hour+":"+minute
        listing_table.innerHTML +=  '<a href="/announcement/'+objJson[i].id_announcement+'" style="text-decoration: none"><div class ="card-style"><span class="announce-index-username" >Par: '+objJson[i].username+'</span></div>'+
'      <div class="annonce-container" style="background: '+objJson[i].color+'">'+
'        <div class="blank">'+
'            <img src="/img/'+objJson[i].image+'" style="width: 100%;height:auto;"/>'+
'        </div>'+
'        <div class="announce-index-content">'+
'          <p>Note actuel : <span style="color:black">'+objJson[i].note+'</span></p>'+
'          <p class="announce-index-name" >'+objJson[i].name_announcement+'</p>'+
'          <p class="announce-index-date" >'+date_converted+'</p>'+
'        </div>'+
'    </div>'+
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





