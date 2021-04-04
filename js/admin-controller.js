var naus = [];
var gamePaused = false;

/**
 * Funció per canviar les mesures del canvas.
 */
function getCanvas() {
    var canvas = document.getElementById("canvas");
    //var context = theCanvas.getContext("2d");
    let alcada = document.getElementById("alcada");
    let amplada = document.getElementById("amplada");
    let estrelles = document.getElementById("estrelles");
    let play = document.querySelector(".play");
    let pause = document.querySelector(".pause");
    // Default values width and height
    alcada.value = canvas.clientHeight;
    amplada.value = canvas.clientWidth;

    play.addEventListener("click", () => {
        if(!gamePaused){
            setCanvas(canvas, alcada.value, amplada.value)
            setEstrelles(estrelles.value, alcada.value, amplada.value)
            gamePaused = true;
        }
    })

    pause.addEventListener("click", () => {
        if(gamePaused){
            connexio.send(JSON.stringify({ action: "changeStars", gamePaused:gamePaused}))
            alert("Joc Pausat")
            gamePaused = false;
        }
    })
}

/*
 * Funció per canviar l'amplada
 */
function setCanvas(canvas, alcada, amplada) {
    canvas.width = amplada;
    canvas.height = alcada;
    connexio.send(JSON.stringify({ action: "changeSize", amplada: amplada, alcada: alcada}))
}

/**
 * Funció per generar tantes estrelles com el valor de l'input
 * @param estrelles: Num de les estrelles de l'input
 * @param alcada: Num de l'alçada de l'input
 * @param amplada: Num de l'amplada de l'input
 */
function setEstrelles(estrelles, alcada, amplada) {
    connexio.send(JSON.stringify({ action: "changeStars", stars: estrelles, alcada: alcada, amplada: amplada, gamePaused:gamePaused}))
}

/**
 * Funció per moure la nau amb les tecles i s'envia un missatge al
 * servidor amb les coordenades actuals.
 */
function updateCanvasAdmin(nau) {
    nau.img = new Image();
    nau.img.src = "../images/nau64pxEnemic.png";
    Game.ctx.drawImage(nau.img, nau.x, nau.y);
    if (existStart) {
        checkStarCollect(naus);
    }

}

// Comprobar si la estrella ha estat atrapada
function checkStarCollect(naus) {
    for (let i = 0; i < naus.length; i++) {
        if (naus[i].star == estrelles.value) {
            if (confirm("Joc Acabat!")) {
                return window.location = '../index.html';
            }
        }
    }
}

/* Funció per obrir i tencar una sessió*/
function openConnection() {
    connexio.onopen = function() { // Obrir sessió
        connexio.send(JSON.stringify({ action: "createAdmin" }));
        getCanvas();
    }
    connexio.onclose = function() { // Si la sessió s'ha tancat
        alert("Se ha tancat la connexió");
        window.location = "../index.html";
    }
    connexio.onerrors = function() { // Si la connexió té un error..
        alert("Se ha interromput la connexió!");
        window.location = "../index.html";
    }
}


function receiveMessage() { /* Quan arriba un missatge, mostrar-lo per consola */
    connexio.onmessage = function(message) {
        let missatge = JSON.parse(message.data);
        console.log(missatge);
        switch (missatge.msg) {
            case "oneAdmin": // Si existeix un administrador redireccionarà cap al index
                Game.existAdmin = missatge.existAdmin;
                if(Game.existAdmin) {
                    window.location = "../index.html";
                }
                break;
            case "paintingStars":
                coordenadesEstrelles = missatge.coordenades;
                printarEstrelles(coordenadesEstrelles);
                existStart = true;
                break;
            case "moveSpaceShip":
                Game.ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (existStart) {
                    coordenadesEstrelles = missatge.stars;
                    printarEstrelles(missatge.stars);
                }
                naus = missatge.naus;
                for (let nau of missatge.naus) {
                    updateCanvasAdmin(nau);
                }
                break;
        }
    }
}

function init() {
    var domini;
    if (window.location.protocol == "file:") domini = "localhost";
    else domini = window.location.hostname;
    var url = "ws://" + domini + ":8180";
    connexio = new WebSocket(url);
    // Obrir la conexió
    openConnection();
    // Message from server
    receiveMessage();
}


init();