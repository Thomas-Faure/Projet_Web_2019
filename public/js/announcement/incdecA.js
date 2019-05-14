"use strict";
function decrementValueA(id,token)
                    {            
                        
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/announcement/decrement');
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.setRequestHeader("x-csrf-token", token);
                        xhr.onload = function() {
                            if (xhr.status === 200) {
                                var xhr2 = new XMLHttpRequest();
                                xhr2.open('GET', '/announcement/'+id+'/vote');
                                xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr2.setRequestHeader("x-csrf-token", token);
                                xhr2.onload = function() {
                                    if (xhr2.status === 200) {
                                        let value = JSON.parse(xhr2.responseText);
                                        document.getElementById(id+'_announcement').innerHTML = value.valeur;
                                      
                                        if(value.suppression == true){
                                            window.location.href = "/announcement/category/all";
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
                function incrementValueA(id,token)
                    {
                   
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/announcement/increment');
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.setRequestHeader("x-csrf-token", token);
                        xhr.onload = function() {
                            if (xhr.status === 200) {
                                
                                var xhr2 = new XMLHttpRequest();
                                xhr2.open('GET', '/announcement/'+id+'/vote');
                                xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr2.setRequestHeader("x-csrf-token", token);
                                xhr2.onload = function() {
                                    if (xhr2.status === 200) {
                                        let value = JSON.parse(xhr2.responseText);
                                        document.getElementById(id+'_announcement').innerHTML = value.valeur;
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