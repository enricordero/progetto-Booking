"use strict"

$(document).ready(function(){
    const username = $("#username")
    const password = $("#password")
    const message = $("#message")
    message.hide()

    $("#btnLogin").on("click", function(){
		window.location.href = "login.html"
	})
	
	$("#btnHome").on("click", function(){
		window.location.href = "index.html"
	})

    $("button[type=button]").on("click", function(){
        if(username.val() == "" || password.val() == ""){
            message.text("Compilare tutti i campi!")
            message.show(500)
        }
        else{
            let rq = inviaRichiesta("GET", "server/login.php", {"username": username.val(), "password": password.val()})
            rq.catch(errore)
            rq.then(function({data}){
                if(data.length!= 0) {
                    sessionStorage.setItem('utente', JSON.stringify(data));
                    window.location.href = "index.html";
                } else {
                    message.text("Username o password errati!");
                    message.show(500);
                }
            })
        }
    })
})