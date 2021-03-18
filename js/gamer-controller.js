/*************************
 * 		DADES GLOBALS
 *************************/
//Canvas
var canvas  = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Mesures canvas
var amplada = canvas.clientWidth;
var altura = canvas.clientHeight;;

// Variabe nau
var spaceShip;

//Posicions nau
var nauX;
var nauY;

//Imatge
var img = new Image();
var cosNau = 64; //64 x 64 píxels

//ID JUGADOR:
var id;

// Objecte per enmagatzemar la nostra tecla premuda
var keysPress = {};

/**
 * Funció que es crida al obrir la pàgina, carrega la imatge de la nau
 * al centre inferior de la pantalla
 */

function crearNau () {
    spaceShip = new Image();
    spaceShip.src = "../images/nau64px.png";
    nauX = canvas.clientWidth / 2 - 32;
    nauY = canvas.clientHeight - 64;
    connexio.send(JSON.stringify({ action: "move", X: nauX, Y: nauY, id: id }));
}

/**
 * Funció per moure la nau amb les tecles i s'envia un missatge al
 * servidor amb les coordenades actuals.
 */
function moureNau(e) {
    //Variables de controls
    var dreta = e.key == "ArrowRight" || e.key == "d";
    var esquerra = e.key == "ArrowLeft" || e.key == "a";
    var amunt = e.key == "ArrowUp" || e.key == "w";
    var avall = e.key == "ArrowDown" || e.key == "s";

    //Si s'apreta alguna tecla de control, evita que la pàigna es mogui
    if (dreta || esquerra || amunt || avall) { e.preventDefault(); }

    if (dreta) {
        var moure = setInterval(function() {
            if (nauX + cosNau > amplada) {
                ctx.clearRect(nauX, nauY, nauX + cosNau, nauY + cosNau);
                ctx.drawImage(img, amplada - cosNau, nauY);
            } else {
                ctx.clearRect(nauX, nauY, nauX + cosNau, nauY + cosNau);
                ctx.drawImage(img, nauX + 1, nauY);
                nauX += 1;
            }
        }, 1);
        //Si es deixa d'apretar, cancel·la el setInterval de moure
        document.addEventListener("keyup", () => { clearInterval(moure); });
    }
    if (esquerra) {
        var moure = setInterval(function() {
            if (nauX < 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, nauY);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, nauX - 1, nauY);
                nauX -= 1;
            }
        }, 1);
        //Si es deixa d'apretar, cancel·la el setInterval de moure
        document.addEventListener("keyup", () => { clearInterval(moure); });
    }

}

/**
 * Funció que ubica totes les naus creades i mogudes fins ara.
 * 
 * @param coordenades : objecte de coordenades de totes les naus creades
 * Format: {id: idJugador, X: posicioX, Y: posicioY}
 */
function ubicarNaus(coordenades) {
    coordenades.forEach(nau => {
        if (nau.id != id) {
            var image = new Image();
            image.src = "../images/nau64pxEnemic.png";
            image.onload = () => { ctx.drawImage(image, nau.X, nau.Y); }
        }
    });
}

/**
 * Events alhora de pulsar una tecla
 */

window.addEventListener("keydown", function (e) {
  keysPress[e.key] = true; // El true només és per indicar el valor del key del objecte
}, false);

window.addEventListener("keyup", function (e) {
  // Amb el event KeyUp el que fem es aturar perquè eliminem la key que es troba en el nostre objecte keysDown
  // la nau ja que aturen la funció recursiva 
  delete keysPress[e.key]; 
}, false);

// // //New update with keyboard controls
function updateCanvas () {
  // Moure nau amunt
  if ("ArrowUp" in keysPress || "w" in keysPress) nauY -= 2;
  // Moure nau abaix
  if ("ArrowDown" in keysPress || "s" in keysPress) nauY += 2; 
  // Moure nau ezquerra
  if ("ArrowLeft" in keysPress || "a" in keysPress) nauX -= 2;
  // Moure nau dreta
  if ("ArrowRight" in keysPress || "d" in keysPress) nauX += 2; 
  ctx.fillStyle = '#b6ddf6' // Background del Canvas
  ctx.fillRect(0, 0, amplada, altura); // Els primers valors es per on comenza el canvas (X, Y) i els dos següents per l' amplada i açada
  ctx.drawImage(spaceShip, nauX, nauY); // Dibuixen la nostra nau en una nova posició
  requestAnimationFrame(updateCanvas) // Actualitzen el canvas amb les noves posicions
}

function init() {

    var domini;
    if (window.location.protocol == "file:") domini = "localhost";
    else domini = window.location.hostname;
    var url = "ws://" + domini + ":8180";
    connexio = new WebSocket(url);

    //Detecta quan s'apreten tecles i crida la funció moureNau.
    connexio.onopen = (event) => {

        connexio.send(JSON.stringify({ action: "addPlayer" }));

        connexio.onmessage = (message) => {
            var missatge = JSON.parse(message.data);
            switch (missatge.msg) {
                case "connected":
                    console.log("Connecting user " + missatge.id);
                    id = missatge.id;
                    crearNau();
                    updateCanvas(); 
                    break;
                case "printShips":
                    console.log(missatge.coordenades);
                    ubicarNaus(missatge.coordenades);
                    break;
            }
        }

    }
}

init();