
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
        setAlcada(canvas, alcada.value)
    })
    amplada.addEventListener("input", () => {
        setAmplada(canvas, amplada.value)
    })
}

/*
* Funció per canviar l'amplada
*/
function setAmplada(canvas, amplada) {
    canvas.width = amplada;
}

/*
* Funció per canviar l'altura
*/
function setAlcada(canvas, alcada) {
    canvas.height = alcada;
}


function init() {
    getCanvas();

    var domini;
	if (window.location.protocol == "file:") domini = "localhost";
	else domini = window.location.hostname;
	var url = "ws://" + domini + ":8180";
	connexio = new WebSocket(url);

	connexio.onopen = (event)=>{

		connexio.send(JSON.stringify({action:"createAdmin"}));
    }
}
