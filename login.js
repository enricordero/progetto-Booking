"use strict"

$(document).ready(function(){
    const username = $("#username")
    const password = $("#password")
    const message = $("#message")
    message.hide()

    $("button[type=button]").on("click", function(){
        if(username.val() == "" || password.val() == ""){
            message.text("Inserire tutti i campi!")
            message.show(500)
        }
        let rq = inviaRichiesta("GET", "server/getUtente.php", {"username": username.val(), "password": password.val()})
        rq.catch(errore)
        rq.then(function({data}){
            console.log(data)
            if(data.length == ""){
                message.text("Username o password errati!")
                message.show(500)
            }
        })
    })
})