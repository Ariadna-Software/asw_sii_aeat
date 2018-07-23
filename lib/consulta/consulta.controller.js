/*
 consulta.controller.js
 Gestión de las rutas de tipos comunicacion en la API
*/
var express = require("express");
var router = express.Router();
var soap = require('soap');
var fs = require('fs');
var cfg = require('../../config.json');
var facturaEmitidasSoap = require("../facturasEmitidas/facturasEmitidas.soap");
var facturaRecibidasSoap = require("../facturasRecibidas/facturasRecibidas.soap");
var async = require('async');


router.get('/emitidas/:nif/:ejercicio/:periodo', function (req, res) {
    var ejercicio = req.params.ejercicio
    var nif = req.params.nif
    var periodo = req.params.periodo
    fnConsultarUnPeriodoEmitidas(nif, ejercicio, periodo, function(err, regs){
        if (err) return res.status(500).send(err.message);
        return res.json(regs);
    })
});

router.get('/emitidas/:nif/:ejercicio', function (req, res) {
    var ejercicio = req.params.ejercicio
    var nif = req.params.nif
    var registros = [];
    async.eachSeries(["01","02","03","04","05","06","07","08","09","10","11","12"], function(periodo, callback){
        fnConsultarUnPeriodoEmitidas(nif,ejercicio,periodo, function(err, regs){
            if (err) return callback(err);
            regs.forEach(function(r){
                registros.push(r);
            })
            callback()  
        })
    }, function(err){
        if (err) return res.status(500).send(err.message);
        return res.json(registros);
    })
});

var fnConsultarUnPeriodoEmitidas = function(nif, ejercicio, periodo, done){
    var filtro = {
        Cabecera: {
            IDVersionSii: "1.1",
            Titular: {
                NombreRazon: nif,
                NIF: nif
            }
        },
        FiltroConsulta: {
            PeriodoImpositivo: {
                Ejercicio: ejercicio,
                Periodo: periodo
            }
        }
    };
    facturaEmitidasSoap.consultaXml(nif, filtro, function (err, regs) {
        if (err) return done(err);
        // controlar si viene sin datos
        registros = [];
        if (regs.ResultadoConsulta == "SinDatos") {
            return done(null, []);
        } else {
            regs.RegistroRespuestaConsultaLRFacturasEmitidas.forEach(element => {
               element.Ejercicio = ejercicio;
               element.Periodo = periodo; 
               registros.push(element);
            });
            return done(null, registros);
        }
    })    
}

router.get('/recibidas/:nif/:ejercicio/:periodo', function (req, res) {
    var ejercicio = req.params.ejercicio
    var nif = req.params.nif
    var periodo = req.params.periodo
    fnConsultarUnPeriodoRecibidas(nif, ejercicio, periodo, function(err, regs){
        if (err) return res.status(500).send(err.message);
        return res.json(regs);
    })
});

router.get('/recibidas/:nif/:ejercicio', function (req, res) {
    var ejercicio = req.params.ejercicio
    var nif = req.params.nif
    var registros = [];
    async.eachSeries(["01","02","03","04","05","06","07","08","09","10","11","12"], function(periodo, callback){
        fnConsultarUnPeriodoRecibidas(nif,ejercicio,periodo, function(err, regs){
            if (err) return callback(err);
            regs.forEach(function(r){
                registros.push(r);
            })
            callback()  
        })
    }, function(err){
        if (err) return res.status(500).send(err.message);
        return res.json(registros);
    })
});

var fnConsultarUnPeriodoRecibidas = function(nif, ejercicio, periodo, done){
    var filtro = {
        Cabecera: {
            IDVersionSii: "1.1",
            Titular: {
                NombreRazon: nif,
                NIF: nif
            }
        },
        FiltroConsulta: {
            PeriodoImpositivo: {
                Ejercicio: ejercicio,
                Periodo: periodo
            }
        }
    };
    facturaRecibidasSoap.consultaXml(nif, filtro, function (err, regs) {
        if (err) return done(err);
        // controlar si viene sin datos
        registros = [];
        if (regs.ResultadoConsulta == "SinDatos") {
            return done(null, []);
        } else {
            regs.RegistroRespuestaConsultaLRFacturasRecibidas.forEach(element => {
               element.Ejercicio = ejercicio;
               element.Periodo = periodo; 
               registros.push(element);
            });
            return done(null, registros);
        }
    })    
}




module.exports = router;