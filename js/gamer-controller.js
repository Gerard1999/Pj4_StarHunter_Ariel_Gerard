
/**
 * Funció que es crida al obrir la pàgina, carrega la imatge de la nau
 * al centre inferior de la pantalla
 */
function crearNau(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = "../images/nau.png";
	var meitat = canvas.clientWidth/2-64;
	var sota = canvas.clientHeight-140;
	

	img.onload = ()=>{ctx.drawImage(img, meitat, sota);}
	
}



function init() {

    var domini;
	if (window.location.protocol == "file:") domini = "localhost";
	else domini = window.location.hostname;
	var url = "ws://" + domini + ":8180";
	connexio = new WebSocket(url);

	connexio.onopen = (event)=>{

		connexio.send(JSON.stringify({action:"addPlayer"}));

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
