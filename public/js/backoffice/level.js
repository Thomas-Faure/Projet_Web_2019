var objJson;

var token = 0
function setToken(token_temp){
    token=token_temp
}

function delete_id(id){
var resultat = "";
var xhr = new XMLHttpRequest();
xhr.open('DELETE', '/announcement/'+id+'/delete'); 
xhr.setRequestHeader("x-csrf-token", token);
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        xhr.onload = function() {
                            if (xhr.status === 200) {
                               let value = JSON.parse(xhr.responseText);
                                resultat = value.valeur;
                                alert(resultat);
                                if(resultat=="supprimé"){
                                    var elem = document.getElementById(+id+"_row");
                                    elem.parentNode.removeChild(elem);
                                }

                                
                            }
                            else {
                                alert('Request failed.  Returned status of ' + xhr.status);
                            }
                        };
                        xhr.send();

}

function setData(data){

document.getElementById('data-backoffice').innerHTML=""


for(var i =0; i< data.length;++i){
    document.getElementById('data-backoffice').innerHTML+='<tr id="'+data[i].id_niveau+'_row"><td>'+data[i].id_niveau+'</td><td>'+data[i].name+'</td><td><a class="btn btn-info" href="/level/'+data[i].id_niveau+'/edit" role="button"><i class="fas fa-cogs"></i></a></td></tr>';
}
var myTable = document.querySelector("table");
var dataTable = new DataTable(myTable);
}
var xhr = new XMLHttpRequest();
xhr.open('GET', '/level'); 
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        xhr.onload = function() {
                            if (xhr.status === 200) {
                               let value = JSON.parse(xhr.responseText);
                                objJson = value;
                                console.log(objJson)
                                setData(objJson);
                            }
                            else {
                                alert('Request failed.  Returned status of ' + xhr.status);
                            }
                        };
                        xhr.send();


