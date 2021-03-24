/*************************
 * 		DADES GLOBALS
 *************************/

//Mesures canvas
var amplada = Game.canvas.clientWidth;
var altura = Game.canvas.clientHeight;

// SpaceShip
var spaceShip;
var imatges = [
    { id: 9, x: 268, y: 386, cosnau: 64, img: '', speed: 3, star: 0 },
    { id: 10, x: 0, y: 0, cosnau: 64, img: '', speed: 3, star: 0 },
    { id: 11, x: 1, y: 200, cosnau: 64, img: '', speed: 3, star: 0 },

]

//ID JUGADOR:
var id;

var coordenadesEstrelles;

/**
 * Funció que ubica totes les naus creades i mogudes fins ara.
 * 
 * @param coordenades : objecte de coordenades de totes les naus creades
 * Format: {id: idJugador, X: posicioX, Y: posicioY}
 */
function createNau(nau) {
    id = nau.id; // Afegim l'id del nostre jugador actuals
    nau.x = Game.canvas.clientWidth / 2 - 32;
    nau.y = Game.canvas.clientHeight - 64;
    nau.img = new Image();
    nau.img.src = "../images/nau64px.png";
    spaceShip = nau;
    console.log(nau)
}
function centerNau(nau) {
    Game.ctx.fillStyle = '#b6ddf6'; // Background del Canvas
    nau.img.onload = () => { Game.ctx.drawImage(spaceShip.img, spaceShip.x, spaceShip.y) }; // Centren l'imatge
    //Game.ctx.fillRect(0, 0, Game.canvas.clientWidth, Game.canvas.clientHeight);
}

/**
 * Funció que es crida al obrir la pàgina, carrega la imatge de la nau
 * al centre inferior de la pantalla
 */

function moureNau(keyPress) {
    if (connexio) {
        connexio.send(JSON.stringify({ action: "move", nau: spaceShip, key: keyPress }));
    }
}

/**
 * Events alhora de pulsar una tecla
 */

window.addEventListener("keydown", function(e) {
    Game.keysPress[e.key] = true; // El true només és per indicar el valor del key del objecte
    moureNau(Game.keysPress);
    e.preventDefault();

}, false);

window.addEventListener("keyup", function(e) {
    // Amb el event KeyUp el que fem es aturar perquè eliminem la key que es troba en el nostre objecte keysDown
    // la nau ja que aturen la funció recursiva
    delete Game.keysPress[e.key];
    e.preventDefault();
}, false);

/**
 * Funció per moure la nau amb les tecles i s'envia un missatge al
 * servidor amb les coordenades actuals.
 */
function updateCanvas(nau) {
    nau.img = new Image();
    nau.img.src = "../images/nau64px.png";
    Game.ctx.drawImage(nau.img, nau.x, nau.y);
    //requestAnimationFrame(updateCanvas) // Actualitzen el canvas amb les noves posicions
}

/**
 * Funció per printar les estrelles al canvas
 * @param coordenadesEstrelles : Objecte amb quantitat i les 
 *                                 coordenades de cada nau
 */
function printarEstrelles(coordenadesEstrelles) {
    for (let i = 0; i < coordenadesEstrelles.length; i++) {
        var estrella = coordenadesEstrelles[i];
        console.log(estrella.id);
        estrella.img = new Image();
        estrella.img.src = "../images/estrella.png";
        estrella.img.onload = Game.ctx.drawImage(estrella.img, estrella.x, estrella.y);
    }
}

/* Funció per obrir i tencar una sessió*/
function openConnection() {
    connexio.onopen = function() { // Obrir sessió
        connexio.send(JSON.stringify({ action: "addPlayer" }));
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
// Missatge rebut pel servidor
function receiveMessage() { /* Quan arriba un missatge, mostrar-lo per consola */
    connexio.onmessage = function(message) {
        let missatge = JSON.parse(message.data);
        switch (missatge.msg) {
            case "connected":
                Game.canvas.width = missatge.amplada;
                Game.canvas.height = missatge.alcada;
                createNau(missatge.nau); // Crear la nau
                centerNau(missatge.nau); // Centrar la nau
                break;
            case "modifyGameClient":
                Game.canvas.width = missatge.amplada;
                Game.canvas.height = missatge.alcada;
                //centerNau(); // bucle
                break;
            case "paintingStars":
                coordenadesEstrelles = missatge.coordenades;
                printarEstrelles(coordenadesEstrelles);
                break;
            case "moveSpaceShip":
                Game.ctx.clearRect(0, 0, canvas.width, canvas.height);
                printarEstrelles(coordenadesEstrelles);
                for(let nau of missatge.naus) {
                    if(nau.id == spaceShip.id) {
                        spaceShip = nau;
                    }
                    updateCanvas(nau);
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