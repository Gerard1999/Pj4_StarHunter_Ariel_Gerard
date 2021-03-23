/**
 * Funció per canviar les mesures del canvas.
 */
function getCanvas() {
    var canvas = document.getElementById("canvas");
    //var context = theCanvas.getContext("2d");
    let alcada = document.getElementById("alcada");
    let amplada = document.getElementById("amplada");
    let estrelles = document.getElementById("estrelles");
    // Default values witdh and height
    alcada.value = canvas.clientHeight;
    amplada.value = canvas.clientWidth;

    alcada.addEventListener("input", () => {
        setCanvas(canvas, alcada.value, amplada.value)
    })
    amplada.addEventListener("input", () => {
        setCanvas(canvas, alcada.value, amplada.value)
    })
    estrelles.addEventListener("input", () => {
        setEstrelles(estrelles.value, alcada.value, amplada.value)
    })
}

/*
 * Funció per canviar l'amplada
 */
function setCanvas(canvas, alcada, amplada) {
    canvas.width = amplada;
    canvas.height = alcada;
    connexio.send(JSON.stringify({ action: "changeSize", amplada: amplada, alcada: alcada }))
}

/**
 * Funció per generar tantes estrelles com el valor de l'input
 * @param estrelles: Num de les estrelles de l'input
 * @param alcada: Num de l'alçada de l'input
 * @param amplada: Num de l'amplada de l'input
 */
function setEstrelles(estrelles, alcada, amplada) {
    connexio.send(JSON.stringify({ action: "changeStars", stars: estrelles, alcada: alcada, amplada: amplada }))
}

/* Funció per obrir i tencar una sessió*/
function openConnection() {
    connexio.onopen = function() { // Obrir sessió
        connexio.send(JSON.stringify({ action: "createAdmin" }));
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