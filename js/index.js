function openConnection() {
    connexio.onopen = function() { // Obrir sessió
        connexio.send(JSON.stringify({ action: "checkPlayGame" }));
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
            case "displayButtonPlay":
                displayButtonPlay(missatge.showPlayButton)
                break;
        }
    }
}

function displayButtonPlay (displayButton) {
    let li = document.querySelectorAll("li")[1];
    let playGame = document.createElement("a"); // Creem el nostre botó
    if(displayButton) {
        playGame.href = "gamer/gamer.html";
        playGame.classList.add("boto");
        playGame.textContent = "Jugar";
        li.appendChild(playGame);
    }else if(!displayButton) {
        li.removeChild(playGame);
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
