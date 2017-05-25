/*
 periodo.controller.js
 Gestión de las rutas de tipos comunicacion en la API
*/
var express = require("express");
var router = express.Router();
var emisoresDb = require("../periodo/periodo.db_mysql");

router.get('/', function (req, res) {
    emisoresDb.get(function (err, grupos) {
        if (err) return res.status(500).send(err.message);
        res.json(grupos);
    });
});

module.exports = router;