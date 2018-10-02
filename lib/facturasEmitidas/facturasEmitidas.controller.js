/*
 facturasEmitidas.controller.js
 Gestión de las rutas de registros de usuarios en la API
*/
var express = require("express");
var router = express.Router();
var facturasEmitidasDb = require("./facturasEmitidas.db_mysql");
var facturasEmitidasDbToJs = require("./facturasEmitidas.dbToJs");
var facturaEmitidasSoap = require("./facturasEmitidas.soap");

var sqlsDb = require("../sqls/sqls");
var config = require("../../config.json");

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// ---------- Acceso a los registros de la base de datos
router.get('/', function (req, res) {
    facturasEmitidasDb.get(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/pendientes', function (req, res) {
    facturasEmitidasDb.getPendientes(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/enviados-incorrectos', function (req, res) {
    facturasEmitidasDb.getEnviadosIncorrectos(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/enviados-correctos', function (req, res) {
    facturasEmitidasDb.getEnviadosCorrectos(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});



router.get('/:IDEnvioFacturasEmitidas', function (req, res) {
    var IDEnvioFacturasEmitidas = req.params.IDEnvioFacturasEmitidas;
    if (!IDEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de envio');
    facturasEmitidasDb.getById(IDEnvioFacturasEmitidas, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        if (registros.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(registros[0]);
    });
})

router.get('/relacionados/:nifEmisor/:numFactura/:fechaFactura', function (req, res) {
    var nifEmisor = req.params.nifEmisor;
    var numFactura = req.params.numFactura.replaceAll('@', '/');
    var fechaFactura = req.params.fechaFactura;
    if (!numFactura || !fechaFactura) return res.status(400).send('Deb indicar un número y fecha de factura');
    facturasEmitidasDb.getRelacionadas(nifEmisor, numFactura, fechaFactura, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
})

router.post('/', function (req, res) {
    var facturaEmitidas = req.body;
    if (!facturaEmitidas) return res.status(400).send('Debe incluir un objeto de envio de factura en el cuerpo del mensaje');
    facturasEmitidasDb.post(facturaEmitidas, function (err, registro) {
        if (err) return res.status(500).send(err.message);
        res.json(registro);
    });
});

router.put('/', function (req, res) {
    var facturaEmitidas = req.body;
    if (!facturaEmitidas) return res.status(400).send('Debe incluir un objeto de envío de fcatura en el cuerpo del mensaje');
    facturasEmitidasDb.put(facturaEmitidas, function (err, registro) {
        if (err) return res.status(500).send(err.message);
        res.json(registro);
    });
});

router.delete('/:IDEnvioFacturasEmitidas', function (req, res) {
    var IDEnvioFacturasEmitidas = req.params.IDEnvioFacturasEmitidas;
    if (!IDEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de envio de facturas emitidas');
    facturasEmitidasDb.delete(IDEnvioFacturasEmitidas, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// -- Envios a la AEAT
router.post('/envDb/:IDEnvioFacturasEmitidas', function (req, res) {
    var IDEnvioFacturasEmitidas = req.params.IDEnvioFacturasEmitidas;
    if (!IDEnvioFacturasEmitidas) return res.status(400).send('Debe indicar el identificador de registro de facturas emitidas');
    facturasEmitidasDb.getById(IDEnvioFacturasEmitidas, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        var registro = registros[0];
        var jsObject = facturasEmitidasDbToJs.emitidasDbToJs(registro);
        facturaEmitidasSoap.sendXml(jsObject, function (err, result) {
            if (err) return res.status(500).send(err.message);
            // Grabamos la respuesta en el mismo registro
            registro.Enviada = 1;
            registro.Resultado = result.RespuestaLinea[0].EstadoRegistro;
            registro.CSV = result.CSV;
            if (!registro.CSV)
                registro.CSV = result.RespuestaLinea[0].CSV;
            if (result.RespuestaLinea[0].CodigoErrorRegistro) {
                registro.Mensaje = "COD: " + result.RespuestaLinea[0].CodigoErrorRegistro + " / " + result.RespuestaLinea[0].DescripcionErrorRegistro
            } else {
                registro.Mensaje = "";
            }
            if (result.xml)
                registro.XML_Enviado = result.xml;
            facturasEmitidasDb.put(registro, function (err, data) {
                if (err) return res.status(500).send(err.message);
                if (config.Axapta == "S") {
                    var sql = "UPDATE [dbo].[CAUSIIFACTURAS] SET [CAUSIISTATUS] = 50";
                    // Son  emitidas 
                    sql += " ,[ENVIADO] = 1";
                    sql += " ,[RESULTADO] = '" + registro.Resultado + "'";
                    if (registro.CSV)
                        sql += " ,[CSV] = '" + registro.CSV + "'";
                    if (registro.Mensaje.length > 100) registro.Mensaje = registro.Mensaje.substr(0, 100);
                    sql += " ,[MENSAJE] = '" + registro.Mensaje + "'";
                    sql += " WHERE [ARIADNAID] = " + registro.IDEnvioFacturasEmitidas;
                    sqlsDb.execSQL2(sql, function (err) {
                        if (err) return res.status(500).send(err.message);
                        res.json(result);
                    })
                } else {
                    res.json(result);
                }
            })
        });
    });
});


router.post('/consulta/:nif/:ejercicio/:periodo', function(req, res) {
    var nif = req.params.nif;
    var ejercicio = req.params.ejercicio;
    var periodo = req.params.periodo;
    //
    var filtro = {
        PeriodoLiquidacion: {
            Ejercicio: ejercicio,
            Periodo: periodo
        }
    }
    facturaEmitidasSoap.consultaXml(nif, filtro, function(err, data){

    })
});
module.exports = router;