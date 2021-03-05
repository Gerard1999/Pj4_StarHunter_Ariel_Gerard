function getCanvas() {
    var canvas = document.getElementById("canvas");
    //var context = theCanvas.getContext("2d");
    let alcada = document.getElementById("alcada");
    let amplada = document.getElementById("amplada");
    // Default values witdh and height
    alcada.value = canvas.clientWidth;
    amplada.value = canvas.clientHeight;

    alcada.addEventListener("input", () => {
        setAlcada(canvas, alcada.value)
    })
    amplada.addEventListener("input", () => {
        setAmplada(canvas, amplada.value)
    })
}
function setAmplada(canvas, amplada) {
    canvas.height = amplada;
}
function setAlcada(canvas, alcada) {
    canvas.width = alcada;
}
function init() {
    getCanvas();
}
