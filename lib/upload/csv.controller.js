var express = require("express");
var router = express.Router();
var path = require('path');
var fs = require('fs');
var csv = require("csv");
var XLSX = require('xlsx');
var moment = require('moment');
var async = require('async');

var facturasEmitidasDb = require("../facturasEmitidas/facturasEmitidas.db_mysql");
var facturasRecibidasDb = require("../facturasRecibidas/facturasRecibidas.db_mysql");

router.post('/', function (req, res) {
    var filename = req.query.filename;
    var tipo = req.query.tipo;
    procesarFichero(filename, tipo, function (err) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json({});
        }
    });
});

var procesarFichero = function (filename, tipo, done) {
    if (!filename) return done(new Error("No hay nigún fichero seleccionado"));
    if (!tipo) return done(new Error("Debe indicar el tipo de fichero."));
    var ext = filename.split('.').pop();
    if (ext != "csv" && ext != "xlsx" && ext != "xls") {
        var mens = "La extensiones de fichero admitidas son csv, xlsx, xls";
        return done(new Error(mens));
    }
    switch (ext) {
        case 'csv':
            trataCsv(filename, tipo, function (err) {
                if (err) return done(err);
                done();
            });
            break;
        case 'xlsx':
        case 'xls':
            trataExcel(filename, tipo, function (err) {
                if (err) return done(err);
                done();
            });
            break;
        default:
            done(null);
            break;
    }
}

var trataCsv = function (f, tipo, done) {
    var fileName = path.join(__dirname, '../../uploads/', f);
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) return done(err);
        var regs = [];
        csv.parse(data, { "delimiter": "," }, function (err, data) {
            // la primera línea lleva las columnsa
            var columnas = data[0];
            for (var i = 1; i < data.length; i++) {
                var reg = constructorObjeto(columnas, data[i], tipo);
                regs.push(reg);
            }
            cargarFacturasDb(regs, tipo, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
};
var trataExcel = function (f, tipo, done) {
    var fileName = path.join(__dirname, '../../uploads/', f);
    var book = XLSX.readFile(fileName);
    var sheet_name = book.SheetNames[0];
    var sheet = book.Sheets[sheet_name];
    var x = XLSX.utils.sheet_to_csv(sheet);
    var fileName2 = path.join(__dirname, '../../uploads/inter.csv')
    fs.writeFileSync(fileName2,x);
    fs.readFile(fileName2, 'utf8', function (err, data) {
        if (err) return done(err);
        var regs = [];
        csv.parse(data, { "delimiter": "," }, function (err, data) {
            // la primera línea lleva las columnsa
            var columnas = data[0];
            for (var i = 1; i < data.length; i++) {
                var reg = constructorObjeto(columnas, data[i], tipo);
                regs.push(reg);
            }
            cargarFacturasDb(regs, tipo, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });    
}

var constructorObjeto = function (c, d, tipo) {
    var o = {}; // objecto a devolver;
    for (var i = 0; i < c.length; i++) {
        o[c[i]] = controlNulos(d[i]);
    }
    if (tipo == 1) {
        o.IDEnvioFacturasEmitidas = 0;
        o = controlFechasEmitidas(o);
    }
    if (tipo == 2) {
        o.IDEnvioFacturasRecibidas = 0;
        o = controlFechasRecibidas(o);
    }
    return o;
}

var controlNulos = function (v) {
    // los nulos vienen como vacíos o como '\N'
    if (v == "") v = null;
    if (v == "\\N") v = null;
    return v;
}

var controlFechasEmitidas = function (o) {
    if (o.FechaHoraCreacion) o.FechaHoraCreacion = controlFecha(o.FechaHoraCreacion);
    if (o.REG_IDF_FechaExpedicionFacturaEmisor) o.REG_IDF_FechaExpedicionFacturaEmisor = controlFecha(o.REG_IDF_FechaExpedicionFacturaEmisor);
    if (o.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor) o.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor = controlFecha(o.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor);
    if (o.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor) o.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor = controlFecha(o.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor);
    if (o.REG_FE_FechaOperacion) o.REG_FE_FechaOperacion = controlFecha(o.REG_FE_FechaOperacion);
    return o;
}
var controlFechasRecibidas = function (o) {
    if (o.FechaHoraCreacion) o.FechaHoraCreacion = controlFecha(o.FechaHoraCreacion);
    if (o.REG_IDF_FechaExpedicionFacturaEmisor) o.REG_IDF_FechaExpedicionFacturaEmisor = controlFecha(o.REG_IDF_FechaExpedicionFacturaEmisor);
    if (o.REG_FR_FA_IDFA_FechaExpedicionFacturaEmisor) o.REG_FR_FA_IDFA_FechaExpedicionFacturaEmisor = controlFecha(o.REG_FR_FA_IDFA_FechaExpedicionFacturaEmisor);
    if (o.REG_FR_FechaOperacion) o.REG_FR_FechaOperacion = controlFecha(o.REG_FR_FechaOperacion);
    if (o.REG_FR_FechaRegContable) o.REG_FR_FechaRegContable = controlFecha(o.REG_FR_FechaRegContable);
    return o;
}

var controlFecha = function (v) {
    var tieneFechaSpain = false;
    var tieneHora = false;
    var format = "", formato2 = "";
    if (v.indexOf('/') > -1) tieneFechaSpain = true;
    if (v.indexOf(':') > -1) tieneHora = true;
    if (tieneFechaSpain) {
        formato = "DD/MM/YYYY";
        formato2 = "YYYY-MM-DD";
        if (tieneHora) {
            formato += " HH:mm:ss";
            formato2 += " HH:mm:ss";
        }
        v = moment(v, formato).format(formato2);
    }
    return v;
}

var cargarFacturasDb = function (regs, tipo, done) {
    async.eachSeries(regs, function (r, callback) {
        if (tipo == 1) {
            facturasEmitidasDb.post(r, function (err) {
                if (err) return callback(err);
                callback();
            });
        }
        if (tipo == 2) {
            facturasRecibidasDb.post(r, function (err) {
                if (err) return callback(err);
                callback();
            });
        }
    }, function (err) {
        if (err) return done(err);
        done();
    });
}
module.exports = router;