"use strict";

const _URL = "" // "http://localhost/4B"
const MAPS_URL = "https://maps.googleapis.com/maps/api/js"
const MAP_KEY = "AIzaSyBZKYgxbiyRE7DknUpnRP2QHCBVjvLgH7g"

// Se vuota viene assegnata in automatico l'origine da cui è stata scaricata la pagina

function inviaRichiesta(method, url, parameters={}) {
	let config={
		"baseURL":_URL,
		"url":  url, 
		"method": method.toUpperCase(),
		"headers": {
			"Accept": "application/json",
		},
		"timeout": 5000,
		"responseType": "json",
	}
	if(parameters instanceof FormData){
		// i parametri rimangono così come sono e vengono inseriti nel body della http request
		config.headers["Content-Type"]='multipart/form-data;' 
		config["data"]=parameters     // Accept FormData, File, Blob
	}	
	else if(method.toUpperCase()=="GET"){
		// i parametri vengono convertiti in URL-Encoded e vengono accodati alla URL
	    config.headers["Content-Type"]='application/x-www-form-urlencoded;charset=utf-8' 
	    config["params"]=parameters   
	}
	else{
		// i parametri vengono convertiti in URL-Encoded ed inseriti nel body della http request
		// Nel caso di PHP, i parametri POST devono essere convertiti in URL_Encoded
		// Nel caso di json-server e nodejs, i parametri POST possono essere trasmessi in json serializzato		
	    config.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8' 
		//config.headers["Content-Type"] = 'application/json; charset=utf-8' 
		config["data"]=parameters    
	}	
	return axios(config)             
}

function errore(err) {
	if(!err.response) 
		alert("Connection Refused or Server timeout");	
	else if (err.response.status == 200)
        alert("Formato dei dati non corretto : " + err.response.data);
    else{
        alert("Server Error: " + err.response.status + " - " + err.response.data);
	}
}

function random(min, max){
	return Math.floor((max-min)*Math.random()) + min;
}

//Images base 64 -> URI file virtualizzato
function base64Convert(fileObject) 
{
    return new Promise(function(resolve, reject){
    let reader = new FileReader();
    reader.readAsDataURL(fileObject);
    reader.onload = function (event) {
        resolve(event.target.result); // event.target sarebbe reader
    };
    reader.onerror = function (error) {
        reject(error);
    };
    });
}


function setAlert(message)
{
	setTimeout(function(){alert(message);}, 100);
}

function setAlertAndReload(message)
{
	setTimeout(function(){alert(message);location.reload();}, 100);
}


//Google Maps:
function caricaGoogleMaps()
{
	return new Promise(function(resolve, reject){
		let script = document.createElement("script");
		script.type="application/javascript"
		script.src=`${MAPS_URL}?v=3&key=${MAP_KEY}`;
		document.body.appendChild(script);
		script.onerror=function(){
			console.log("Error on Google Maps' load");
			reject(err);
		};
		script.onload=function(){
			resolve();
		};
	})
	
}

// dal 2024 l'indicazione della callback Ã¨ diventata obbligatoria
function loadingDone(){
	console.log("Google Maps caricate correttamente")
}


// importazione di una libreria dinamica (consigliato dal 2024)
function loadGoogleMapsDinamically(){
	(g => {
		let h,a,k,
			p="The Google Maps JavaScript API",
			c="google",
			l="importLibrary",
			q="__ib__",
			m=document,
			b=window;
		b=b[c]||(b[c]={})
		let d=b.maps||(b.maps={}),
			r=new Set,
			e=new URLSearchParams,
			u=()=>h||(h=new Promise(async(f,n)=>{
				await (a=m.createElement("script"));
				e.set("libraries",[...r]+"");
				for(k in g)
					e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);
				e.set("callback",c+".maps."+q);
				a.src=`https://maps.${c}apis.com/maps/api/js?`+e;
				d[q]=f;
				a.onerror=()=>h=n(Error(p+" could not load."));
				a.nonce=m.querySelector("script[nonce]")?.nonce||"";
				m.head.append(a);
			}))
			d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))
	})
	({
		key: MAP_KEY,
		v: "weekly",    
	})
}
//end Google Maps


//I for each:
/*
Vettori javaScript metodo -> .forEach(item, i).

Vettore jQuery metodo -> .each(i,item).

In ogni caso "item" è sempre tipo javaScript (per uso jQuery $(item)).
*/

//Ordinare un JSON
/*
let myKey = "key";

myArray.sort(function(record1, record2) {
 let str1 = record1[myKey].toUpperCase();
 let str2 = record2[myKey].toUpperCase();
 if (str1 < str2)
 return -1;
 else if (str1 > str2)
 return 1;
 else return 0;
 }); 
*/