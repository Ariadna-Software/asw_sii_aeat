/*
 facrecibidas.controller.js
 Gestión de las rutas de emsiores en la API
*/
var express = require("express");
var router = express.Router();
var facrecibidasDb = require("../facrecibidas/facrecibidas.db_mysql");

router.get('/', function (req, res) {
    facrecibidasDb.get(function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/:FacRecibidaId', function (req, res) {
    var FacRecibidaId = req.params.FacRecibidaId;
    if (!FacRecibidaId) return res.status(400).send('Debe indicar el identificador del emisor');
    facrecibidasDb.getById(FacRecibidaId, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        if (grupos.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(grupos[0]);
    });
})

router.post('/', function (req, res) {
    var facrecibidas = req.body;
    if (!facrecibidas) return res.status(400).send('Debe incluir un objeto emisor en el cuerpo del mensaje');
    facrecibidasDb.post(facrecibidas, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.put('/', function (req, res) {
    var facrecibidas = req.body;
    if (!facrecibidas) return res.status(400).send('Debe incluir un objeto de emisor en el cuerpo del mensaje');
    facrecibidasDb.put(facrecibidas, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.delete('/:FacRecibidaId', function (req, res) {
    var FacRecibidaId = req.params.FacRecibidaId;
    if (!FacRecibidaId) return res.status(400).send('Debe indicar el identificador de envio de fcaturas emitidas');
    facrecibidasDb.delete(FacRecibidaId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

module.exports = router;