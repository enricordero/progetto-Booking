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

	let utente = JSON.parse(sessionStorage.getItem('utente'));
    if (utente && utente.citta) {
        console.log(utente.citta); // Ora dovresti avere accesso alla proprietà 'citta'
    } else {
        console.log("Dati dell'utente non disponibili");
    }

	let rq = inviaRichiesta("GET", "server/elencoCitta.php")
	rq.catch(errore)
	rq.then(function(response){
		response.data.forEach(item => {
			let divCitta = $("<div>").addClass("form-check form-check-inline").appendTo(sezCitta)
			$("<input>").prop({
				"type": "radio",
				"name": "inlineRadioOptions",
				"id": "inlineRadio" + item["id"],
				"value": "option" + item["id"]
			}).appendTo(divCitta)
			.on("click", function(){
				sezHotel.empty()
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
							$("<img>").prop("src", "img/star.png").appendTo(h4)
						}
						$("<p>").text(hotel["descrizione"]).appendTo(divInterno)
						$("<a>").prop("href", "#").addClass("btn btn-primary").text("Dettagli")
						.on("click", function(){ vediDettagli(hotel) }).appendTo(divInterno)
						$("<p>Prezzi a partire da </p>").append($("<span>").text("80€").addClass("prezzo")).appendTo(divInterno)
					});
				})
			})
			$("<label>").addClass("form-check-label").prop("for", "inlineRadio"+item["id"]).text(item["citta"]).appendTo(divCitta)
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
		/*let tipoStanza = ""
		switch (txtNumPersone.val()) {
			case 1:
				tipoStanza = "singola"
				break;
			case 2:
				tipoStanza = "doppia"
				break;
			case 3:
				tipoStanza = "tripla"
				break;
			case 5:
				tipoStanza = "suite"
				break;
			default:
				break;
		}
		let prenotazione = {
			"codUtente": 9,
			"dataInizio": inputDataInizio.val(),
			"dataFine": inputDataFine.val(),
			"nPersone": txtNumPersone.val(),
			"prezzoPerPersona": "",
			"tipoStanza": tipoStanza
		}
		rq = inviaRichiesta("POST", "aggiornaPrenotazioni.php", {prenotazione})
		rq.catch(errore)
		rq.then(function(){
			alert("Prenotazione eseguita")
		})*/
	})
});
