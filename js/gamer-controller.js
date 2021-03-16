/*************************
 * 		DADES GLOBALS
 *************************/
//Canvas
var canvas;
var ctx;

//Mesures canvas
var amplada;
var altura;

//Posicions nau
var nauX;
var nauY;

//Imatge
var img = new Image();
var cosNau = 64; //64 x 64 píxels


/**
 * Funció que es crida al obrir la pàgina, carrega la imatge de la nau
 * al centre inferior de la pantalla
 */
function crearNau() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");


    img.src = "../images/nau64px.png";
    nauX = canvas.clientWidth / 2 - 32;
    nauY = canvas.clientHeight - 64;
    amplada = canvas.clientWidth;
    altura = canvas.clientHeight;
    img.onload = () => { ctx.drawImage(img, nauX, nauY); }
}

/**
 * Funció per moure la nau amb les tecles i s'envia un missatge al
 * servidor amb les coordenades actuals.
 */
function moureNau(e) {
    var dreta = e.key == "ArrowRight" || e.key == "d";
    var esquerra = e.key == "ArrowLeft" || e.key == "a";
    var amunt = e.key == "ArrowUp" || e.key == "w";
    var avall = e.key == "ArrowDown" || e.key == "s";
    if (dreta || esquerra || amunt || avall) { e.preventDefault(); }
    if (dreta) {
        var moure = setInterval(function() {
            if (nauX + cosNau > amplada) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, amplada - cosNau, nauY);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
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



function init() {

    var domini;
    if (window.location.protocol == "file:") domini = "localhost";
    else domini = window.location.hostname;
    var url = "ws://" + domini + ":8180";
    connexio = new WebSocket(url);

    //Detecta quan s'apreten tecles i crida la funció moureNau.
    document.addEventListener("keydown", moureNau);

    connexio.onopen = (event) => {

        connexio.send(JSON.stringify({ action: "addPlayer" }));

        connexio.onmessage = (message) => {
            var missatge = JSON.parse(message.data);
            switch (missatge.msg) {
                case "connected":
                    console.log("Connecting user " + missatge.id);
                    crearNau();
                    break;
            }
        }

    }
}


window.onload = init;