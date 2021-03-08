function getCanvas() {
    var canvas = document.getElementById("canvas");
    //var context = theCanvas.getContext("2d");
    let alcada = document.getElementById("alcada");
    let amplada = document.getElementById("amplada");
    // Default values witdh and height
    alcada.value = canvas.clientHeight;
    amplada.value = canvas.clientWidth;

    alcada.addEventListener("input", () => {
        setAlcada(canvas, alcada.value)
    })
    amplada.addEventListener("input", () => {
        setAmplada(canvas, amplada.value)
    })
}
function setAmplada(canvas, amplada) {
    canvas.width = amplada;
}
function setAlcada(canvas, alcada) {
    canvas.height = alcada;
}
function init() {
    getCanvas();
}
