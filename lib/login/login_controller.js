/*
 login_controller.js
 Rutas de manejo de l login
*/

var express = require("express");
var router = express.Router();
var loginDb = require("../login/login_db_mysql");

router.post('/', function(req, res){
    var usuario = req.body.usuario;
    if (!usuario || !usuario.login || ! usuario.password) return res.status(400).send("Petición de login incorrecta");
    loginDb.login(usuario.login, usuario.password, function(err, usuario){
        if (err) return res.status(500).send(err.message);
        res.json(usuario);
    })
});

router.post('/clave', function(req, res){
    var usuario = req.body.usuario;
    if (!usuario || !usuario.login || ! usuario.password) return res.status(400).send("Petición de login incorrecta");
    loginDb.loginConClave(usuario.login, usuario.password, function(err, usuario){
        if (err) return res.status(500).send(err.message);
        res.json(usuario);
    })
});

module.exports = router;