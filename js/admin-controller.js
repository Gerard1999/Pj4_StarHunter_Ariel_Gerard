/**
 * Funció per canviar les mesures del canvas.
 */
function getCanvas() {
    var canvas = document.getElementById("canvas");
    //var context = theCanvas.getContext("2d");
    let alcada = document.getElementById("alcada");
    let amplada = document.getElementById("amplada");
    // Default values witdh and height
    alcada.value = canvas.clientHeight;
    amplada.value = canvas.clientWidth;

    alcada.addEventListener("input", () => {
        setCanvas(canvas, alcada.value, amplada.value)
    })
    amplada.addEventListener("input", () => {
        setCanvas(canvas, alcada.value, amplada.value)
    })
}

/*
* Funció per canviar l'amplada
*/
function setCanvas(canvas, alcada, amplada) {
    canvas.width = amplada;
    canvas.height = alcada;
    connexio.send(JSON.stringify({action:"changeSize", amplada: amplada, alcada: alcada}))
}

/* Funció per obrir i tencar una sessió*/
function openConnection() { 
	connexio.onopen = function() { // Obrir sessió
        connexio.send(JSON.stringify({action:"createAdmin"})
		);
	}
	connexio.onclose = function() { // Si la sessió s'ha tancat
		alert("Se ha tancat la connexió");
		window.location = "gamer.html";
	}
	connexio.onerrors = function() { // Si la connexió té un error..
		alert("Se ha interromput la connexió!");
		window.location = "gamer.html";
	}
}

function init() {
    getCanvas();
    var domini;
	if (window.location.protocol == "file:") domini = "localhost";
	else domini = window.location.hostname;
	var url = "ws://" + domini + ":8180";
	connexio = new WebSocket(url);
    openConnection();
}


window.onload = init;
