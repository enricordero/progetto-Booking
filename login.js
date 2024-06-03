"use strict"

$(document).ready(function(){
    const username = $(".username")
    const password = $(".password")
    const username2 = $(".username2")
    const password2 = $(".password2")
    const citta = $(".inputcitta")
    const message = $(".message")
    message.hide()

    $("#loginSection").show()
    $("#registerSection").hide()

    $("#btnLogin").on("click", function(){
		window.location.href = "login.html"
	})
	
	$("#btnHome").on("click", function(){
		window.location.href = "index.html"
	})

    $("#btnLogin.btn.btn-primary").on("click", function(){
        if(username.val() == "" || password.val() == ""){
            message.text("Compilare tutti i campi!")
            message.show(500)
        }
        else{
            let rq = inviaRichiesta("GET", "server/login.php", {"username": username.val(), "password": password.val()})
            rq.catch(errore)
            rq.then(function({data}){
                if(data.length != 0) {
                    sessionStorage.setItem('utente', JSON.stringify(data));
                    window.location.href = "index.html";
                } else {
                    message.text("Username o password errati!");
                    message.show(500);
                }
            })
        }
    })

    $("#btnRegistrati.btn.btn-primary").on("click", function(){
        if(username2.val() == "" || password2.val() == "" || citta.val() == ""){
            message.text("Compilare tutti i campi!")
            message.show(500)
        }
        else{
            let rq = inviaRichiesta("GET", "server/register.php", {"username": username2.val(), "password": password2.val(), "citta": citta.val()})
            rq.catch(errore)
            rq.then(function({data}){
                if(data.length != 0) {
                    console.log(data)
                    //window.location.href = "login.html";
                } else {
                    message.text("Username o password errati!");
                    message.show(500);
                }
            })
        }
    })

    $("#registrati").on("click", function(){
        $("#loginSection").hide()
        $("#registerSection").show()
    })
})