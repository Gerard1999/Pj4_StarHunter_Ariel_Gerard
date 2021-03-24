// https://developer.mozilla.org/es/docs/Glossary/IIFE
// Es una función autojecutable donde guardo los parámetros globales del JS para así poder llamarlos
var Game = (function() {
    var canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d")
    return {
        canvas: canvas,
        starsCollected: 0,
        ctx: ctx,
        over: false,
        keysPress: {},
        move: false,
        render: requestAnimationFrame
    }
}())
