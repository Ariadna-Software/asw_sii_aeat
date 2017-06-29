// auto_facEmitidas.js
// Demonio que lanza cada cierto tiempo una búsqueda en la base de datos para enviar
// aquellas facturas que estén pendientes de envío
var emitidas = require("./emitidas");

var isRunnigFacEmitidas = false;

var id = setInterval(function () {
    if (isRunnigFacEmitidas) return;
    isRunnigFacEmitidas = true;
    emitidas.enviarGrupo(function(err){
        isRunnigFacEmitidas = false;
        if (err) console.log("ERR AUTO EMITIDAS: " + err.message);
    });
}, 5000); // lanzado cada 5 segundos
