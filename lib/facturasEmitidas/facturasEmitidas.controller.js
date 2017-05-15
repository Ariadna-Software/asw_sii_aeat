/*
 facturasEmitidas.controller.js
 Gestión de las rutas de grupos de usuarios en la API
*/
var express = require("express");
var router = express.Router();
var facturasEmitidasDb = require("../facturasEmitidas/facturasEmitidas.db_mysql");

router.get('/', function (req, res) {
    facturasEmitidasDb.get(function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/:IdEnvioFacturasEmitidas', function (req, res) {
    var IdEnvioFacturasEmitidas = req.params.IdEnvioFacturasEmitidas;
    if (!IdEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de envio');
    facturasEmitidasDb.getById(IdEnvioFacturasEmitidas, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        if (grupos.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(grupos[0]);
    });
})

router.post('/', function (req, res) {
    var facturaEmitidas = req.body;
    if (!facturaEmitidas) return res.status(400).send('Debe incluir un objeto de envio de factura en el cuerpo del mensaje');
    facturasEmitidasDb.post(facturaEmitidas, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.put('/', function (req, res) {
    var facturaEmitidas = req.body;
    if (!facturaEmitidas) return res.status(400).send('Debe incluir un objeto de envío de fcatura en el cuerpo del mensaje');
    facturasEmitidasDb.put(facturaEmitidas, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.delete('/:IdEnvioFacturasEmitidas', function (req, res) {
    var IdEnvioFacturasEmitidas = req.params.IdEnvioFacturasEmitidas;
    if (!IdEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de envio de fcaturas emitidas');
    facturasEmitidasDb.delete(IdEnvioFacturasEmitidas, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

module.exports = router;