//Servidor

var http = require('http');
var path = require('path');
var fs = require('fs');

var server = http.createServer((req, res) => {
    req.on('error', function(err) { // error
        console.error(err);
    }).on('data', function(dades) { // dades parcials
        cosPeticio += dades;
    }).on('end', function() { // s'han rebut totes les dades
        fs.readFile('index.html', (error, data) => {

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            console.log("dins");
            res.end();
        });
    });
});


server.listen(8080, () => console.log("Servidor en marxa..."));