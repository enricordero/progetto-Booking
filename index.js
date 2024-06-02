'use strict'

$(document).ready(function(){

	let vetCitta = []

    let sezione2 = $(".row").eq(1) 
    let sezione3 = $(".row").eq(2).hide()
	
	let sezCitta = $(".citta")
	let sezHotel = $(".hotel")
	let sezDettagli = $(".dettagli")

	let inputDataInizio = $("#inputDataInizio")
	let inputDataFine = $("#inputDataFine")
	let txtNumPersone = $("#txtNumPersone")

	let btnPrenota = $("#Prenota")

	$("#btnLogin").on("click", function(){
		window.location.href = "login.html"
	})

	$("#btnHome").on("click", function(){
		window.location.href = "index.html"
	})

	let utente = JSON.parse(sessionStorage.getItem('utente'))
    if (utente) {
		$("#pfp").prop("src", "img/utenti/" + utente[0]["imgProfilo"])
		$("#nomeUtente").text(utente[0]["username"])
    } else {
        console.log("Dati dell'utente non disponibili")
    }

	let rq = inviaRichiesta("GET", "server/elencoCitta.php")
	rq.catch(errore)
	rq.then(function(response){
		response.data.forEach(item => {
			let divCitta = $("<div>").addClass("form-check form-check-inline").appendTo(sezCitta)
			let div = $("<div>").css({
				"width": "200px",
				"height": "200px",
				"background-image": "url(img/citta/" + item["citta"] + ".jpg)",
				"background-size": "cover",
				"margin": "10px",
				"border-radius": "10px",
				"background-repeat": "no-repeat",
				"padding": "20px",
				"color": "white",
				"box-shadow": "4px 4px green, 8px 8px white, 12px 12px red",
				"transition": "all 200ms"
			}).appendTo(divCitta)
			div.append($("<span>").text(item["citta"] + " "))	
			div.append($("<img>").prop("src", "img/italianFlag.png"))
			div.on("mouseenter", function(){
				$(this).css("scale", "1.05")
			})
			div.on("mouseout", function(){
				$(this).css("scale", "1.00")
			})
			div.on("click", function(){
				sezHotel.empty()
				vetCitta = []
				let citta = item["citta"]
				rq = inviaRichiesta("GET", "server/elencoHotel.php", {citta})
				rq.catch(errore)
				rq.then(function(response){
					response.data.forEach(element => {
						if(element["citta"] == citta){
							vetCitta.push(element)
						}
					});
					vetCitta.forEach(hotel => {
						let divEsterno = $("<div>").appendTo(sezHotel)
						$("<img>").prop("src", "img/hotels/"+hotel["img"]).appendTo(divEsterno)
						let divInterno = $("<div>").appendTo(divEsterno)
						let h4 = $("<h4>").appendTo(divInterno)
						$("<span>").text(hotel["nomeHotel"]).appendTo(h4)
						for(let i = 0; i < hotel["stelle"]; i++){
							$("<img>").prop("src", "img/star.png").css("margin", "1px").appendTo(h4)
						}
						$("<p>").text(hotel["descrizione"]).appendTo(divInterno)
						$("<a>").prop("href", "#").css("margin", "5px").addClass("btn btn-primary").text("Dettagli")
						.on("click", function(){ vediDettagli(hotel) }).appendTo(divInterno)
						$("<a>").prop("href", "#").css("margin", "5px").addClass("btn btn-primary").text("Recensioni")
						.on("click", function(){ alert("recensioni") }).appendTo(divInterno)
						$("<a>").prop("href", "#").css("margin", "5px").addClass("btn btn-primary").text("Location")
						.on("click", function(){ alert("Geolocation") }).appendTo(divInterno)
						$("<p>Prezzi a partire da </p>").append($("<span>").text("80€").addClass("prezzo")).appendTo(divInterno)
					});
				})
			})
		});
	})

	function vediDettagli(hotel){
		sezione2.hide()
		sezione3.show()
		$("<h3>").text(hotel["nomeHotel"]).appendTo(sezDettagli)
		$("<p>").text(hotel["indirizzo"] + " - " + hotel["CAP"] + " " + hotel["citta"]).appendTo(sezDettagli)
		let div1 = $("<div>").appendTo(sezDettagli)
		let codHotel = hotel["codHotel"]
		let rq = inviaRichiesta("GET", "server/getFoto.php", {codHotel})
		rq.catch(errore)
		rq.then(function(response){
			response.data.forEach(img => {
				$("<img>").prop("src", "img/hotels/" + img["url"]).appendTo(div1)
			})
		})
		let div2 = $("<div>").appendTo(sezDettagli)
		$("<p>").text(hotel["descrizione"]).appendTo(div2)
		$("<h3>").text("Tariffe").appendTo(div2)
		rq = inviaRichiesta("GET", "server/getTariffe.php", {codHotel})
		rq.catch(errore)
		rq.then(function(response){
			console.log(response.data)
			response.data.forEach(tariffa => {
				$("<p>").text("dal " + tariffa["dataInizio"] + " al " + tariffa["dataFine"] + " al prezzo di " + tariffa["prezzo"] + "€").appendTo(div2)
			});
		})
	}

	inputDataInizio.on("change", function(){
		inputDataFine.prop("disabled", false)
		inputDataFine.val(inputDataInizio.val())
		inputDataFine.prop("min", inputDataInizio.val())
	})

	btnPrenota.on("click", function(){
		alert("prenota")
	})
});
