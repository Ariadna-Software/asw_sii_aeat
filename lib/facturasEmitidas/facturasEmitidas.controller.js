/*
 facturasEmitidas.controller.js
 Gestión de las rutas de registros de usuarios en la API
*/
var express = require("express");
var router = express.Router();
var facturasEmitidasDb = require("./facturasEmitidas.db_mysql");
var facturasEmitidasDbToJs = require("./facturasEmitidas.dbToJs");
var facturaEmitidasSoap = require("./facturasEmitidas.soap");

// ---------- Acceso a los registros de la base de datos
router.get('/', function (req, res) {
    facturasEmitidasDb.get(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/pendientes', function (req, res) {
    facturasEmitidasDb.getPendientes(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/enviados-incorrectos', function (req, res) {
    facturasEmitidasDb.getEnviadosIncorrectos(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/enviados-correctos', function (req, res) {
    facturasEmitidasDb.getEnviadosCorrectos(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});



router.get('/:IDEnvioFacturasEmitidas', function (req, res) {
    var IDEnvioFacturasEmitidas = req.params.IDEnvioFacturasEmitidas;
    if (!IDEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de envio');
    facturasEmitidasDb.getById(IDEnvioFacturasEmitidas, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        if (registros.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(registros[0]);
    });
})

router.post('/', function (req, res) {
    var facturaEmitidas = req.body;
    if (!facturaEmitidas) return res.status(400).send('Debe incluir un objeto de envio de factura en el cuerpo del mensaje');
    facturasEmitidasDb.post(facturaEmitidas, function (err, registro) {
        if (err) return res.status(500).send(err.message);
        res.json(registro);
    });
});

router.put('/', function (req, res) {
    var facturaEmitidas = req.body;
    if (!facturaEmitidas) return res.status(400).send('Debe incluir un objeto de envío de fcatura en el cuerpo del mensaje');
    facturasEmitidasDb.put(facturaEmitidas, function (err, registro) {
        if (err) return res.status(500).send(err.message);
        res.json(registro);
    });
});

router.delete('/:IDEnvioFacturasEmitidas', function (req, res) {
    var IDEnvioFacturasEmitidas = req.params.IDEnvioFacturasEmitidas;
    if (!IDEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de envio de facturas emitidas');
    facturasEmitidasDb.delete(IDEnvioFacturasEmitidas, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// -- Envios a la AEAT
router.post('/envDb/:IDEnvioFacturasEmitidas', function (req, res) {
    var IDEnvioFacturasEmitidas = req.params.IDEnvioFacturasEmitidas;
    if (!IDEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de registro de facturas emitidas');
    facturasEmitidasDb.getById(IDEnvioFacturasEmitidas, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        var registro = registros[0];
        var jsObject = facturasEmitidasDbToJs.emitidasDbToJs(registro);
        facturaEmitidasSoap.sendXml(jsObject, function (err, result) {
            if (err) return res.status(500).send(err.message);
            // Grabamos la respuesta en el mismo registro
            registro.Enviada = 1;
            registro.Resultado = result.RespuestaLinea[0].EstadoRegistro;
            registro.CSV = result.CSV;
            if (!registro.CSV)
                registro.CSV = result.RespuestaLinea[0].CSV;
            if (result.RespuestaLinea[0].CodigoErrorRegistro) {
                registro.Mensaje = "COD: " + result.RespuestaLinea[0].CodigoErrorRegistro + " / " + result.RespuestaLinea[0].DescripcionErrorRegistro
            } else {
                registro.Mensaje = "";
            }

            if (result.xml)
                registro.XML_Enviado = result.xml;
            facturasEmitidasDb.put(registro, function (err, data) {
                if (err) return res.status(500).send(err.message);
                res.json(result);
            })
        });
    });
});

module.exports = router;