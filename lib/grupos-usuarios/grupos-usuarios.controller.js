/*
 grupos-usuarios.controller.js
 Gestión de las rutas de grupos de usuarios en la API
*/
var express = require("express");
var router = express.Router();
var gruposUsuariosDb = require("../grupos-usuarios/grupos-usuarios.db_mysql");

router.get('/', function (req, res) {
    gruposUsuariosDb.get(function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

router.get('/:grupoUsuarioId', function (req, res) {
    var grupoUsuarioId = req.params.grupoUsuarioId;
    if (!grupoUsuarioId) return res.status(400).send('Debe indicar el identificador de grupo');
    gruposUsuariosDb.getById(grupoUsuarioId, function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        if (grupos.length == 0) return res.status(404).send("Grupo no encontrado");
        res.json(grupos[0]);
    });
})

router.post('/', function (req, res) {
    var grupoUsuarios = req.body;
    if (!grupoUsuarios) return res.status(400).send('Debe incluir un objeto de grupo en el cuerpo del mensaje');
    gruposUsuariosDb.post(grupoUsuarios, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.put('/', function (req, res) {
    var grupoUsuarios = req.body;
    if (!grupoUsuarios) return res.status(400).send('Debe incluir un objeto de grupo en el cuerpo del mensaje');
    gruposUsuariosDb.put(grupoUsuarios, function (err, grupo) {
        if (err) return res.status(500).send(err.message);
        res.json(grupo);
    });
});

router.delete('/:grupoUsuarioId', function (req, res) {
    var grupoUsuarioId = req.params.grupoUsuarioId;
    if (!grupoUsuarioId) return res.status(400).send('Debe indicar el identificador de grupo');
    gruposUsuariosDb.delete(grupoUsuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

module.exports = router;