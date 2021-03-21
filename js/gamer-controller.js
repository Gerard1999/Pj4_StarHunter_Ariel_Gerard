/*************************
 * 		DADES GLOBALS
 *************************/
//Mesures canvas
var amplada = Game.canvas.clientWidth;
var altura = Game.canvas.clientHeight;

// SpaceShip
var spaceShip;

//Posicions nau
var nauX;
var nauY;

//ID JUGADOR:
var id;

/**
 * Funció que ubica totes les naus creades i mogudes fins ara.
 * 
 * @param coordenades : objecte de coordenades de totes les naus creades
 * Format: {id: idJugador, X: posicioX, Y: posicioY}
 */
function createNau (nau) {
    spaceShip = nau; // Asignem la nostra variable global Spaceship i fiquen dintre l'objecte nau
    id = spaceShip.id; // Afegim l'id del nostre jugador actualss
    nauX = amplada / 2 - 32;
    nauY = altura - 64;
    spaceShip.img = new Image();
    spaceShip.img.src = "../images/nau64px.png";
    spaceShip.x = nauX;
    spaceShip.y = nauY;
}

function centerNau () {
    Game.ctx.fillStyle = '#b6ddf6'; // Background del Canvas
    Game.ctx.fillRect(0, 0, amplada, altura);
    spaceShip.img.onload = () => {Game.ctx.drawImage(spaceShip.img, nauX, nauY)}; // Centren l'imatge
}

/**
 * Funció que es crida al obrir la pàgina, carrega la imatge de la nau
 * al centre inferior de la pantalla
 */

function moureNau() {
	if (connexio) { 
        connexio.send(JSON.stringify( { action: "move", nau: spaceShip })); 
    }
}

/**
 * Events alhora de pulsar una tecla
 */

window.addEventListener("keydown", function (e) {
  Game.keysPress[e.key] = true; // El true només és per indicar el valor del key del objecte
  moureNau();
  e.preventDefault();
  
}, false);

window.addEventListener("keyup", function (e) {
  // Amb el event KeyUp el que fem es aturar perquè eliminem la key que es troba en el nostre objecte keysDown
  // la nau ja que aturen la funció recursiva
  delete Game.keysPress[e.key]; 
  e.preventDefault();
}, false);

/**
 * Funció per moure la nau amb les tecles i s'envia un missatge al
 * servidor amb les coordenades actuals.
 */
 function updateCanvas () {
    spaceShip.img = new Image();
    spaceShip.img.src = "../images/nau64px.png";
    // Moure nau amunt
    if ("ArrowUp" in Game.keysPress || "w" in Game.keysPress) 
    spaceShip.y > -64 ? spaceShip.y -= spaceShip.speed : spaceShip.y = altura;
    // Moure nau abaix
    if ("ArrowDown" in Game.keysPress || "s" in Game.keysPress) 
        spaceShip.y < altura ? spaceShip.y += spaceShip.speed : spaceShip.y = -64;
    // Moure nau ezquerra
    if ("ArrowLeft" in Game.keysPress || "a" in Game.keysPress) 
        spaceShip.x > -64 ? spaceShip.x -= spaceShip.speed : spaceShip.x = amplada;
    // Moure nau dreta
    if ("ArrowRight" in Game.keysPress || "d" in Game.keysPress) 
        spaceShip.x < amplada ? spaceShip.x += spaceShip.speed : spaceShip.x = -64;
        
    Game.ctx.fillStyle = '#b6ddf6' // Background del Canvas
    Game.ctx.fillRect(0, 0, amplada, altura); // Els primers valors es per on comenza el canvas (X, Y) i els dos següents per l' amplada i açada
    Game.ctx.drawImage(spaceShip.img, spaceShip.x, spaceShip.y); // Dibuixen la nostra nau en una nova posició
    Game.render(updateCanvas) // Actualitzen el canvas amb les noves posicions
    //spaceShip.img.onload = () => {Game.ctx.drawImage(spaceShip.img, spaceShip.x, spaceShip.y)};
}


/* Funció per obrir i tencar una sessió*/
function openConnection() { 
	connexio.onopen = function() { // Obrir sessió
        connexio.send(JSON.stringify({ action: "addPlayer"})
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
// Missatge rebut pel servidor
function receiveMessage() { /* Quan arriba un missatge, mostrar-lo per consola */
	connexio.onmessage = function(message) {
		let missatge = JSON.parse(message.data), nau;
        nau = missatge.nau;
        switch (missatge.msg) {
            case "connected":      
                createNau(nau); // Crear la nau
                centerNau(); // Centrar la nau
                //updateCanvas();
                // Bucle
                break;
            case "moveSpaceShip":
                spaceShip = nau;
                spaceShip.img = new Image();
                spaceShip.img.src = "../images/nau64px.png";
                console.log(nau);
                updateCanvas();
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