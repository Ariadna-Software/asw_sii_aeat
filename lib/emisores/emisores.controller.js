/*
 titulares.controller.js
 Gestión de las rutas de grupos de usuarios en la API
*/
var express = require("express");
var router = express.Router();
var titularesDb = require("../titulares/titulares.db_mysql");

router.get('/', function (req, res) {
    titularesDb.get(function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/:titularId', function (req, res) {
    var titularId = req.params.titularId;
    if (!titularId) return res.status(400).send('Debe indicar el identificador del titular');
    titularesDb.getById(titularId, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        if (grupos.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(grupos[0]);
    });
})

router.post('/', function (req, res) {
    var titulares = req.body;
    if (!titulares) return res.status(400).send('Debe incluir un objeto titular en el cuerpo del mensaje');
    titularesDb.post(titulares, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.put('/', function (req, res) {
    var titulares = req.body;
    if (!titulares) return res.status(400).send('Debe incluir un objeto de titular en el cuerpo del mensaje');
    titularesDb.put(titulares, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.delete('/:titularId', function (req, res) {
    var titularId = req.params.titularId;
    if (!titularId) return res.status(400).send('Debe indicar el identificador de envio de fcaturas emitidas');
    titularesDb.delete(titularId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

module.exports = router;