var existNau = false;
var existStart = false;

// SpaceShip
var spaceShip;

/**
 * Funció que ubica totes les naus creades i mogudes fins ara.
 * 
 * @param coordenades : objecte de coordenades de totes les naus creades
 * Format: {id: idJugador, X: posicioX, Y: posicioY}
 */
function createNau(nau) {
    if (!existNau) {
        nau.x = Game.canvas.clientWidth / 2 - 32;
        nau.y = Game.canvas.clientHeight - 64;
        nau.img = new Image();
        nau.img.src = "../images/nau64px.png";
        spaceShip = nau;
        puntuacio.innerText = 0;
        centerNau(nau); // Centrar la nau
        existNau = true;
    }
}

/**
 * Funció per printar les estrelles al canvas
 * @param coordenadesEstrelles : Objecte amb quantitat i les 
 *                                 coordenades de cada nau
 */
function printarEstrelles(coordenadesEstrelles) {
    for (let i = 0; i < coordenadesEstrelles.length; i++) {
        estrella = coordenadesEstrelles[i];
        estrella.img = new Image();
        estrella.img.src = "../images/estrella.png";
        estrella.img.onload = Game.ctx.drawImage(estrella.img, estrella.x, estrella.y);
    }
}