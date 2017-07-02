var express = require("express");
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.post('/', function (req, res) {
    var filename = req.query.filename;
    procesarFichero(filename, function(err){
        if (err) return res.status(500).send(err.message);
    });
});

var procesarFichero = function(filename, done){
    if (!filename) return done(new Error("No hay nigún fichero seleccionado"));
    var ext = fichero.split('.').pop();
    if (ext != "csv" && ext != "xlsx" && ext !="xls"){

    }
}

module.exports = router;