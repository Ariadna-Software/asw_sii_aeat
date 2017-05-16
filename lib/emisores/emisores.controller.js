/*
 emisores.controller.js
 Gestión de las rutas de emsiores en la API
*/
var express = require("express");
var router = express.Router();
var emisoresDb = require("../emisores/emisores.db_mysql");

router.get('/', function (req, res) {
    emisoresDb.get(function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/:emisorId', function (req, res) {
    var emisorId = req.params.emisorId;
    if (!emisorId) return res.status(400).send('Debe indicar el identificador del emisor');
    emisoresDb.getById(emisorId, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        if (grupos.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(grupos[0]);
    });
})

router.post('/', function (req, res) {
    var emisores = req.body;
    if (!emisores) return res.status(400).send('Debe incluir un objeto emisor en el cuerpo del mensaje');
    emisoresDb.post(emisores, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.put('/', function (req, res) {
    var emisores = req.body;
    if (!emisores) return res.status(400).send('Debe incluir un objeto de emisor en el cuerpo del mensaje');
    emisoresDb.put(emisores, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.delete('/:emisorId', function (req, res) {
    var emisorId = req.params.emisorId;
    if (!emisorId) return res.status(400).send('Debe indicar el identificador de envio de fcaturas emitidas');
    emisoresDb.delete(emisorId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

module.exports = router;