// auto_facRecibidas.js
// Demonio que lanza cada cierto tiempo una búsqueda en la base de datos para enviar
// aquellas facturas que estén pendientes de envío

var recibidas = require("./recibidas");

var isRunnigFacRecibidas = false;

var id = setInterval(function () {
    if (isRunnigFacRecibidas) return;
    isRunnigFacRecibidas = true;
    recibidas.enviarGrupo(function (err) {
        isRunnigFacRecibidas = false;
        if (err) console.log("ERR AUTO RECIBIDAS: " + err.message);
    })
}, 5000); // lanzado cada 5 segundos

