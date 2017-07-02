var express = require("express");
var router = express.Router();
var path = require('path');
var fs = require('fs');
var csv = require("csv");
var XLSX = require('xlsx');

router.post('/', function (req, res) {
    var filename = req.query.filename;
    procesarFichero(filename, function (err) {
        if (err) return res.status(500).send(err.message);
    });
});

var procesarFichero = function (filename, done) {
    if (!filename) return done(new Error("No hay nigún fichero seleccionado"));
    var ext = filename.split('.').pop();
    if (ext != "csv" && ext != "xlsx" && ext != "xls") {
        var mens = "La extensiones de fichero admitidas son csv, xlsx, xls";
        return done(new Error(mens));
    }
    switch (ext) {
        case 'csv':
            trataCsv(filename, function (err) {
                done(err);
            });
            break;
        case 'xlsx':
        case 'xls':
            trataExcel(filename, function (err) {
                done(err);
            });
            break;
        default:
            done(null);
            break;
    }
}

var trataCsv = function (f, done) {
    var fileName = path.join(__dirname, '../../uploads/', f);
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) return done(err);
        csv.parse(data, { "delimiter": "," }, function (err, data) {
            // la primera línea lleva las columnsa
            var columnas = data[0];
            for (var i = 1; i < data.length; i++) {
                var reg = constructorObjeto(columnas, data[i]);
            }
        });
    });
};
var trataExcel = function (f, done) {
    var fileName = '../../uploads/' + f;
}

var constructorObjeto = function (c, d) {
    var o = {}; // objecto a devolver;
    for (var i = 0; i < c.length; i++) {
        o[c[i]] = d[i];
    }
    o[0] = 0; // el id es cero para altas
    return o;
}

module.exports = router;