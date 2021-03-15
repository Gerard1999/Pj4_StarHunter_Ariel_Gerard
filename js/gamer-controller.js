

function init() {

    var domini;
	if (window.location.protocol == "file:") domini = "localhost";
	else domini = window.location.hostname;
	var url = "ws://" + domini + ":8180";
	connexio = new WebSocket(url);

	connexio.onopen = (event)=>{

		connexio.send(JSON.stringify({action:"jugant"}));
    }
}
