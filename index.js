'use strict'

$(document).ready(function () {

	let vetCitta = []

	let sezione2 = $(".row").eq(1)
	let sezione3 = $(".row").eq(2).hide()

	let sezCitta = $(".citta")
	let sezHotel = $(".hotel")
	let sezDettagli = $(".dettagli")
	let sezRecensioni = $(".recensioni")
	let sezAggiungiRecensione = $(".aggiungiRecensione")
	sezAggiungiRecensione.hide()

	let inputDataInizio = $("#inputDataInizio")
	let inputDataFine = $("#inputDataFine")
	let txtNumPersone = $("#txtNumPersone")

	let btnPrenota = $("#Prenota")

	//TODO: add langhe.jpg as a background

	$("#btnLogin").on("click", function () {
		window.location.href = "login.html"
	})

	$("#btnHome").on("click", function () {
		window.location.href = "index.html"
	})

	let utente = JSON.parse(sessionStorage.getItem('utente'))
	if (utente) {
		$("#nomeUtente").text(utente[0]["username"])
		if (!utente[0]["imgProfilo"])
			$("#pfp").prop("src", "img/utenti/defaultIMG.png")
		else {
			$("#pfp").prop("src", "img/utenti/" + utente[0]["imgProfilo"])
		}
	} else {
		console.log("Dati dell'utente non disponibili")
	}

	let rq = inviaRichiesta("GET", "server/elencoCitta.php")
	rq.catch(errore)
	rq.then(function (response) {
		response.data.forEach(item => {
			let divCitta = $("<div>").addClass("form-check form-check-inline").appendTo(sezCitta)
			let div = $("<div>").css({
				"width": "210px",
				"height": "210px",
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
			div.append($("<span>").text(item["citta"] + " ").css("font-size", "14pt"))
			div.append($("<img>").prop("src", "img/italianFlag.png"))
			div.on("mouseenter", function () {
				$(this).css("scale", "1.02")
			})
			div.on("mouseout", function () {
				$(this).css("scale", "1.00")
			})
			div.on("click", function () {
				sezHotel.empty()
				vetCitta = []
				if(utente){
					let citta = item["citta"]
					rq = inviaRichiesta("GET", "server/elencoHotel.php", { citta })
					rq.catch(errore)
					rq.then(function (response) {
						response.data.forEach(element => {
							if (element["citta"] == citta) {
								vetCitta.push(element)
							}
						});
						vetCitta.forEach(hotel => {
							let divEsterno = $("<div>").css({
								"background-color": "rgba(255, 255, 255, 0.85)",
								"border-radius": "10px",
							}).appendTo(sezHotel)
							$("<img>").prop("src", "img/hotels/" + hotel["img"]).css("border-radius", "15px").appendTo(divEsterno)
							let divInterno = $("<div>").appendTo(divEsterno)
							let h4 = $("<h4>").appendTo(divInterno)
							$("<span>").text(hotel["nomeHotel"]).appendTo(h4)
							for (let i = 0; i < hotel["stelle"]; i++) {
								$("<img>").prop("src", "img/star.png").css("margin", "1px").appendTo(h4)
							}
							$("<p>").text(hotel["descrizione"]).appendTo(divInterno)
	
							$("<a>").prop("href", "#").css("margin", "5px").addClass("btn btn-primary").text("Dettagli")
								.on("click", function () { vediDettagli(hotel) }).appendTo(divInterno)
	
							$("<a>").prop("href", "#").css("margin", "5px").addClass("btn btn-primary").text("Recensioni")
								.on("click", function () { stampaRecensioni(hotel) }).appendTo(divInterno)
	
							$("<a>").prop("href", "#").css("margin", "5px").addClass("btn btn-info").text("Location")
								.on("click", async function () { await sweetAlertMappa(hotel) }).appendTo(divInterno)
						});
					})
				}
				else{
					Swal.fire({
						html: `
							<h3> Devi eseguire l'accesso prima di visualizzare gli hotel</h3>
							<img src="img/noRecensione.png" width="200px">
							`
					})
				}
			})

		});
	})

	function vediDettagli(hotel) {
		sezione2.hide()
		sezione3.show()
		let nHotel = hotel["nomeHotel"]
		$("#nomeHotel").text("DETTAGLI HOTEL").css("text-align", "center")
		$("<h3>").text(nHotel.toUpperCase()).appendTo(sezDettagli)
		$("<p>").text(hotel["indirizzo"] + " - " + hotel["CAP"] + " " + hotel["citta"]).appendTo(sezDettagli)
		let div1 = $("<div>").appendTo(sezDettagli)
		let codHotel = hotel["codHotel"]
		let rq = inviaRichiesta("GET", "server/getFoto.php", { codHotel })
		rq.catch(errore)
		rq.then(function (response) {
			response.data.forEach(img => {
				$("<img>").prop("src", "img/hotels/" + img["url"]).appendTo(div1)
			})
		})
		let div2 = $("<div>").appendTo(sezDettagli)
		$("<p>").text(hotel["descrizione"]).appendTo(div2)

		$("<h3>").text("SERVIZI DISPONIBILI").appendTo(div2)
		$("<b>").text("Wi-Fi ").appendTo(div2)
		if (hotel["wifi"] == 1) {
			$("<img>").prop("src", "img/greenCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		else if (hotel["wifi"] == 0) {
			$("<img>").prop("src", "img/redCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		$("<b>").text("Piscina ").appendTo(div2)
		if (hotel["piscina"] == 1) {
			$("<img>").prop("src", "img/greenCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		else if (hotel["piscina"] == 0) {
			$("<img>").prop("src", "img/redCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		$("<b>").text("SPA ").appendTo(div2)
		if (hotel["spa"] == 1) {
			$("<img>").prop("src", "img/greenCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		else if (hotel["spa"] == 0) {
			$("<img>").prop("src", "img/redCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		$("<b>").text("Colazione ").appendTo(div2)
		if (hotel["colazioneInclusa"] == 1) {
			$("<img>").prop("src", "img/greenCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		else if (hotel["colazioneInclusa"] == 0) {
			$("<img>").prop("src", "img/redCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		$("<b>").text("Cena ").appendTo(div2)
		if (hotel["cenaInclusa"] == 1) {
			$("<img>").prop("src", "img/greenCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		else if (hotel["cenaInclusa"] == 0) {
			$("<img>").prop("src", "img/redCheck.png").css({ "width": "20px", "height": "20px" }).appendTo(div2)
			$("<br>").appendTo(div2)
		}
		$("<br>").appendTo(div2)

		let singoleLibere = hotel["stanzeSingole"] - hotel["singolePrenotate"]
		let doppieLibere = hotel["stanzeDoppie"] - hotel["doppiePrenotate"]
		let tripleLibere = hotel["stanzeTriple"] - hotel["triplePrenotate"]
		let quadrupleLibere = hotel["stanzeQuadruple"] - hotel["quadruplePrenotate"]
		let suitesLibere = hotel["suites"] - hotel["suitesPrenotate"]

		$("<h3>").text("STANZE DISPONIBILI").appendTo(div2)
		$("<p>").text("Stanze singole: " + singoleLibere + "/" + hotel["stanzeSingole"]).appendTo(div2)
		$("<p>").text("Stanze doppie: " + doppieLibere + "/" + hotel["stanzeDoppie"]).appendTo(div2)
		$("<p>").text("Stanze triple: " + tripleLibere + "/" + hotel["stanzeTriple"]).appendTo(div2)
		$("<p>").text("Stanze quadruple: " + quadrupleLibere + "/" + hotel["stanzeQuadruple"]).appendTo(div2)
		$("<p>").text("Stanze suites: " + suitesLibere + "/" + hotel["suites"]).appendTo(div2)
		$("<br>").appendTo(div2)

		rq = inviaRichiesta("GET", "server/getTariffe.php", { codHotel })
		rq.catch(errore)
		rq.then(function (response) {
			if (response.data.length != 0) {
				$("<h3>").text("TARIFFE").appendTo(div2)
				response.data.forEach(tariffa => {
					$("<p>").text("Dal " + tariffa["dataInizio"] + " al " + tariffa["dataFine"] + " al prezzo di " + tariffa["prezzo"] + "€").appendTo(div2)
				});
			}
		})

	}

	function sweetAlertMappa(hotel) {
		Swal.fire({
			title: `<h3>${hotel["nomeHotel"]}</h3>`,
			showCloseButton: true,
			showConfirmButton: false,
			width: '600px',
			html: `
			<div><b>Indirizzo:</b> ${hotel["citta"]}, ${hotel["indirizzo"]}</div>
			<div><b>Stelle:</b> ${hotel["stelle"]} </div>
			<br>
			<div id='divMap' width='500' height='500' style='margin: 0 auto;'></div>
			`,
			didOpen: function () {
				let mapContainer = document.getElementById("divMap");
				mapContainer.style.width = '500px';
				mapContainer.style.height = '500px';

				let geocoder = new google.maps.Geocoder();
				geocoder.geocode({ address: `${hotel["citta"]}, ${hotel["indirizzo"]}` }, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						let pos = results[0]["geometry"]["location"];
						let mapOptions = {
							center: pos,
							zoom: 15,
							styles: [
								{
									"featureType": "poi",
									"stylers": [
										{ "visibility": "off" }
									]
								}
							]

						};

						let map = new google.maps.Map(document.getElementById('divMap'), mapOptions);

						let marker = new google.maps.Marker({
							position: pos,
							map: map,
							title: hotel["nomeHotel"],
							icon: "img/hotelMarker.png",
							animation: google.maps.Animation.DROP
						});

					} else {
						alert("Error: address not found");
					}
				});
			},
			background: "rgba(255, 255, 255, 0.98)"
		})
	}

	function stampaRecensioni(hotel) {
		sezCitta.hide()
		sezHotel.hide()
		sezRecensioni.show()
		sezAggiungiRecensione.hide()
		sezRecensioni.empty()

		$("#titolone").text("RECENSIONI").show()
		let rq = inviaRichiesta("GET", "server/getRecensioni.php", { "codHotel": hotel["codHotel"] })
		rq.catch(errore)
		rq.then(function ({ data }) {
			data.forEach(function (item) {
				let divEsterno = $("<div>").css({
					"background-color": "rgba(255, 255, 255, 0.95)",
					"border-radius": "10px",
					"padding": "5px",
					"margin": "5px"
				}).appendTo(sezRecensioni)
				let divInterno = $("<div>").appendTo(divEsterno)
				let h4 = $("<h4>").appendTo(divInterno)
				rq = inviaRichiesta("GET", "server/getUtente.php", { "codUtente": item["codUtente"] })
				rq.catch(errore)
				rq.then(function ({ data }) {
					$("<img>").prop("src", "img/utenti/" + data[0]["imgProfilo"]).css({ "width": "40px", "border-radius": "50%" }).appendTo(h4)
						.on("error", function () {
							$(this).prop("src", "img/utenti/defaultIMG.png").css({ "width": "40px", "border-radius": "50%" }).prependTo(h4)
						})
					$("<span>").text(data[0]["username"]).appendTo(h4)
					$("<br>").appendTo(h4)
					for (let i = 0; i < item["stelle"]; i++) {
						$("<img>").prop("src", "img/star.png").css({ "margin": "1px", "width": "25px" }).appendTo(h4)
					}
					for (let i = item["stelle"]; i < 5; i++) {
						$("<img>").prop("src", "img/greyStar.png").css({ "margin": "1px", "width": "25px" }).appendTo(h4)
					}
					$("<p>").text(item["testoRecensione"]).appendTo(divInterno)
					$("<br>").appendTo(divInterno)
					let dataRecensione = item["dataRec"].substr(0, 10)
					$("<p>").text(dataRecensione).appendTo(divInterno)

				})
			})
			$("<button>").text("Torna agli hotel").addClass("btn btn-primary").appendTo(sezRecensioni)
				.on("click", function () { window.location.href = "index.html" })
			$("<button>").text("Aggiungi una recensione").addClass("btn btn-primary").appendTo(sezRecensioni)
				.on("click", function () { aggiungiRecensione(hotel) })
		})
	}

	function aggiungiRecensione(hotel) {
		let today = new Date();
		let formattedDate = today.toISOString().split('T')[0];
		let dataRec = formattedDate + " " + `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

		sezCitta.hide()
		sezHotel.hide()
		sezRecensioni.hide()
		sezAggiungiRecensione.show()

		let messaggioRecensione = $("#messaggioRecensione")
		let stelleRecensione = $("#stelleRecensione")
		messaggioRecensione.val("")
		stelleRecensione.val("")

		$("#btnAnnulla").on("click", function () {
			sezAggiungiRecensione.hide()
			sezRecensioni.show()
		})

		$("#btnAggiungiRecensione").on("click", function () {
			if (stelleRecensione.val() != "") {
				let rq = inviaRichiesta("POST", "server/aggiungiRecensione.php", {
					"codHotel": hotel["codHotel"],
					"codUtente": utente[0]["codUtente"],
					"stelle": stelleRecensione.val(),
					"testoRecensione": messaggioRecensione.val(),
					"dataRec": dataRec
				})
				rq.catch(errore)
				rq.then(function ({ data }) {
					Swal.fire({
						title: `<h3 style="color: green; font-weight: bold;">Recensione aggiunta con successo!</h3>`,
						showCloseButton: true,
						showConfirmButton: true,
						width: '600px',
						html: `<img src="img/siRecensione.png" width="200px">`,
						background: "rgba(255, 255, 255, 0.98)",
					}).then(function () {
						stampaRecensioni(hotel)
					});
				})
			}
			else {
				Swal.fire({
					title: `<h3 style="color: red; font-weight: bold;">La tua recensione non è stata aggiunta!</h3>`,
					showCloseButton: true,
					showConfirmButton: true,
					width: '600px',
					html: `
					<p> La valutazione è obbligatoria per lasciare una recensione </p>
					<img src="img/noRecensione.png" width="200px">
					`,
					background: "rgba(255, 255, 255, 0.98)",
				})
			}
		})
	}

	inputDataInizio.on("change", function () {
		inputDataFine.prop("disabled", false)
		inputDataFine.val(inputDataInizio.val())
		inputDataFine.prop("min", inputDataInizio.val())
	})

	btnPrenota.on("click", function () {
		//let codHotel = 
		let codUtente = utente[0]["codUtente"]

	})
});
