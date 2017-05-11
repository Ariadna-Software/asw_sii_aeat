/*
 usuarios.controller.js
 Gestión de las rutas de usuarios de usuarios en la API
*/
var express = require("express");
var router = express.Router();
var usuariosDb = require("../usuarios/usuarios.db_mysql");

router.get('/', function (req, res) {
    usuariosDb.get(function (err, usuarios) {
        if (err) return res.status(500).send(err.message);
        res.json(usuarios);
    });
});

router.get('/:usuarioId', function (req, res) {
    var usuarioId = req.params.usuarioId;
    if (!usuarioId) return res.status(400).send('Debe indicar el identificador de usuario');
    usuariosDb.getById(usuarioId, function (err, usuarios) {
        if (err) return res.status(500).send(err.message);
        if (usuarios.length == 0) return res.status(404).send("Grupo no encontrado");
        res.json(usuarios[0]);
    });
})

router.post('/', function (req, res) {
    var usuarios = req.body;
    if (!usuarios) return res.status(400).send('Debe incluir un objeto de usuario en el cuerpo del mensaje');
    usuariosDb.post(usuarios, function (err, usuario) {
        if (err) return res.status(500).send(err.message);
        res.json(usuario);
    });
});

router.put('/', function (req, res) {
    var usuarios = req.body;
    if (!usuarios) return res.status(400).send('Debe incluir un objeto de usuario en el cuerpo del mensaje');
    usuariosDb.put(usuarios, function (err, usuario) {
        if (err) return res.status(500).send(err.message);
        res.json(usuario);
    });
});

router.delete('/:usuarioId', function (req, res) {
    var usuarioId = req.params.usuarioId;
    if (!usuarioId) return res.status(400).send('Debe indicar el identificador de usuario');
    usuariosDb.delete(usuarioId, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

module.exports = router;