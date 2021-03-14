//Servidor

var http = require('http');
var path = require('path');
var fs = require('fs');

// Tipus de extensions permesses
const FILE_TYPES = {
	html:"text/html",
	css:"text/css",
	js:"text/js",
	svg:"image/svg+xml",
	png:"image/png",
	gif:"image/gif",
	ico:"image/ico",
	jpg:"image/jpg",
	jpeg:"image/jpg",
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
		resposta.writeHead(404, {'Content-Type': 'text/html'});
		resposta.end("404 Not Found");
		return;
	}
	resposta.writeHead(200, {'Content-Type': tDocument});
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
            console.log(tipusDocument)
            if (tipusDocument) fs.readFile(filename, function(err, data) { enviarArxiu(err, data, res, tipusDocument); });
			else {
				resposta.writeHead(400, {'Content-Type': 'text/html'});
				resposta.end("Tipus d'arxiu desconegut.");
			}
        }
    });
});


server.listen(8080, () => console.log("Servidor en marxa..."));