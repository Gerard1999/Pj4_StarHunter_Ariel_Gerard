//Servidor
var Nau = require('./js/Nau.js'); // Importem la clase Nau
var http = require('http');
var path = require('path');
var fs = require('fs');

// Tipus de extensions permesses
const FILE_TYPES = {
    html: "text/html",
    css: "text/css",
    js: "text/js",
    svg: "image/svg+xml",
    png: "image/png",
    gif: "image/gif",
    ico: "image/ico",
    jpg: "image/jpg",
    jpeg: "image/jpg",
};
// Obtenir el tipus de extensió permesa
function contentType(filename) {
    var ext = filename.split('.').pop(); // Obtenim l'extensió del fitxer html, css, jpg...
    if (ext in FILE_TYPES) return FILE_TYPES[ext]; // Comproven si es trova dintre del nostre enum
    else return undefined;
}
// Envia l'arxiu al client amb un error si el troba llavors el mostrarà
function enviarArxiu(err, dades, resposta, tDocument) {
    if (err) {
        resposta.writeHead(404, { 'Content-Type': 'text/html' });
        resposta.end("404 Not Found");
        return;
    }
    resposta.writeHead(200, { 'Content-Type': tDocument });
    resposta.end(dades);
}

var server = http.createServer((req, res) => {
    req.on('error', function(err) { // error
        console.error(err);
    }).on('data', function(dades) { // dades parcials
        cosPeticio += dades;
    }).on('end', function() { // s'han rebut totes les dades
        res.on('error', function(err) {
            console.error(err);
        });
        if (req.method == 'GET') { // Si la petició es Get...
            const baseURL = 'http://' + req.headers.host + '/'; // obtenemos la URL (http://localhost/)
            dades = new URL(req.url, baseURL); // Creem una nova URL (req.url = index.html por ejemplo)
            var filename = `.${dades.pathname}`; // obtenim el path de tots els fitxers que depenen del html, com per exemple el CSS 
            if (filename == "./") filename += "index.html"; // Posar per defecte el index.html
            var tipusDocument = contentType(filename); // Obtenim el tipus de document text/html, text/css, etc.
            if (tipusDocument) fs.readFile(filename, function(err, data) { enviarArxiu(err, data, res, tipusDocument); });
            else {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end("Tipus d'arxiu desconegut.");
            }
        }
    });
});


server.listen(8080, () => console.log("Servidor en marxa!"));



/*******************************************
 *				WEB SOCKETS
 *******************************************/

// Carregar el mòdul per WebSockets
const WebSocket = require('ws');

// Crear servidor WebSocket
const wss = new WebSocket.Server({ port: 8180 });

wss.on('connection', (remitent, peticio) => {
    remitent.on('message', message => {
        processar(remitent, message);
    });
});

/**
 * Funció per fer Broadcast
 * @param missatge : Cos del missatge
 * @param clientExclos : ID usuari que no rebrà el missatge
 */
function broadcast(missatge, clientExclos) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && client !== clientExclos) {
            client.send(missatge);
        }
    });
}


/****************************
 * 		DADES GENERALS
 ***************************/
var jugadors = [];
var coordenadesNaus = [];

// Últim identificador assignat
var jugadorID = 0;


/**
 * Funció principal que gestiona els missatges rebuts des del client.
 * 
 * @param ws: Connexió socket del client
 * @param m: Missatge rebut
 */
function processar(ws, missatge) {
    var message = JSON.parse(missatge);
    switch (message.action) {
        case "createAdmin":
            console.log("Creating Admin...");
            crearAdmin(ws);
            break;
        case "addPlayer":
            console.log("Creating Player...");
            crearJugador(ws, message);
            break;
        case "changeSize":
            //console.log("Changing Sizes...");
            //canviarMides(ws, missatge);
            break;
        case "move":
            console.log("Moving...");
            console.log(message.nau)
            moureNau(ws, message)
            break;
            /*case "undo":
            	console.log("Desfent última línia...");
            	break;
            case "delete":
            	console.log("Esborrant línies...");
            	break;
            default:*/

    }
}

/**
 * Aquesta funció crea l'admin. Només hi podrà haver un
 * (Nose si des d'aquí, però s'haurà d'evitar que entri algú altre com admin
 * i també evitar poder entrar a "Jugar" sense haver entrat a "Admin" abans).
 * 
 * @param ws: Connexió socket del client
 */
function crearAdmin(ws) {

}


/**
 * Aquesta funció crea un nou jugador amb un identificador únic
 * Li envia aquest id i les coordenades de les naus ja inicialitzades
 * Li envia les coordenades de la nau del nou jugador
 * 
 * @paravar spaceShipm ws: Connexió socket del client
 */
function crearJugador(ws, message) {
    let spaceShip = new Nau();
    spaceShip.id = jugadorID++;
    jugadors.push(spaceShip);
    ws.send(JSON.stringify({msg: "connected", nau: spaceShip}));
}


/**
 * Aquesta funció actualitza les noves mides del canvas rebudes des de l'admin
 * Envia a tothom les noves mides
 * 
 * @param ws: Connexió socket del client
 * @param m: Missatge rebut
 */
function canviarMides(ws, m) {

}


/**
 * Aquesta funció actualitza les noves coordenades de la nau moguda
 * Envia a tothom les noves coordenades
 * 
 * @param ws: Connexió socket del client
 * @param m: Missatge rebut
 */
function moureNau(ws, m) {
    let spaceShip = m.nau;
    ws.send(JSON.stringify({ msg: "moveSpaceShip", nau: spaceShip }));
    //broadcast(JSON.stringify({ msg: "moveSpaceShip", coordenades: coordenadesNaus }), idJugador);

}