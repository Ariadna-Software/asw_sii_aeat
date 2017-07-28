/*
 facemitidas.controller.js
 Gestión de las rutas de emsiores en la API
*/
var express = require("express");
var router = express.Router();
var facemitidasDb = require("../facemitidas/facemitidas.db_mysql");

router.get('/', function (req, res) {
    var nifTitular = req.query.nifTitular;
    facemitidasDb.get(nifTitular, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});


router.get('/pendientes', function (req, res) {
    var nifTitular = req.query.nifTitular;
    facemitidasDb.getPendientes(nifTitular, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/enviadas-incorrectas', function (req, res) {
    var nifTitular = req.query.nifTitular;
    facemitidasDb.getEnviadasIncorrectas(nifTitular, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/enviadas-correctas', function (req, res) {
    var nifTitular = req.query.nifTitular;
    facemitidasDb.getEnviadasCorrectas(nifTitular, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/:FacEmitidaId', function (req, res) {
    var FacEmitidaId = req.params.FacEmitidaId;
    if (!FacEmitidaId) return res.status(400).send('Debe indicar el identificador del facemitida');
    facemitidasDb.getById(FacEmitidaId, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        if (grupos.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(grupos[0]);
    });
})

router.post('/', function (req, res) {
    var facemitidas = req.body;
    if (!facemitidas) return res.status(400).send('Debe incluir un objeto facemitida en el cuerpo del mensaje');
    facemitidasDb.post(facemitidas, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.post('/enviar', function (req, res) {
    var nifTitular = req.query.nifTitular;
    var facId = req.query.facId;
    facemitidasDb.envioFacEmitidasPendientes(nifTitular, facId, function (err, mens) {
        if (err) return res.status(500).send(err.message);
        res.json(mens);
    });
});

router.put('/', function (req, res) {
    var facemitidas = req.body;
    if (!facemitidas) return res.status(400).send('Debe incluir un objeto de facemitida en el cuerpo del mensaje');
    facemitidasDb.put(facemitidas, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.delete('/:FacEmitidaId', function (req, res) {
    var FacEmitidaId = req.params.FacEmitidaId;
    if (!FacEmitidaId) return res.status(400).send('Debe indicar el identificador de envio de fcaturas emitidas');
    facemitidasDb.delete(FacEmitidaId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

module.exports = router;