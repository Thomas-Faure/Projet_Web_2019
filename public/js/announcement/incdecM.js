function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
    }
    function decrementValueM(id,elid,token)
        {            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/message/decrement');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("x-csrf-token", token);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var xhr2 = new XMLHttpRequest();
                    xhr2.open('GET', '/message/'+id+'/vote');
                    xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr2.setRequestHeader("x-csrf-token", token);
                    xhr2.onload = function() {
                        if (xhr2.status === 200) {
                            let value = JSON.parse(xhr2.responseText);
                            document.getElementById(id+'_message').innerHTML = value.valeur;
                            if(value.suppression==true){
                                var elem = document.getElementById("div-message-"+id);
                                elem.parentNode.removeChild(elem);
                                objJson = arrayRemove(objJson,objJson[elid])
                                
                                changePage(page_actuel);
                                
                            }
                            
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
            xhr.send("id="+id);

            

    };
    function incrementValueM(id,token)
        {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/message/increment');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("x-csrf-token", token);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    
                    var xhr2 = new XMLHttpRequest();
                    xhr2.open('GET', '/message/'+id+'/vote');
                    xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr2.setRequestHeader("x-csrf-token", token);
                    xhr2.onload = function() {
                        if (xhr2.status === 200) {
                            let value = JSON.parse(xhr2.responseText);
                            document.getElementById(id+'_message').innerHTML = value.valeur;
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
            xhr.send("id="+id);

            
    }