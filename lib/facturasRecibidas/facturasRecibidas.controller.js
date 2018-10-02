/*
 facturasRecibidas.controller.js
 Gestión de las rutas de registros de usuarios en la API
*/
var express = require("express");
var router = express.Router();
var facturasRecibidasDb = require("./facturasRecibidas.db_mysql");
var facturasRecibidasDbToJs = require("./facturasRecibidas.dbToJs");
var facturaRecibidasSoap = require("./facturasRecibidas.soap");

var sqlsDb = require("../sqls/sqls");
var config = require("../../config.json");

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// ---------- Acceso a los registros de la base de datos
router.get('/', function (req, res) {
    facturasRecibidasDb.get(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/pendientes', function (req, res) {
    facturasRecibidasDb.getPendientes(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/enviados-incorrectos', function (req, res) {
    facturasRecibidasDb.getEnviadosIncorrectos(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});

router.get('/enviados-correctos', function (req, res) {
    facturasRecibidasDb.getEnviadosCorrectos(function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
});



router.get('/:IDEnvioFacturasRecibidas', function (req, res) {
    var IDEnvioFacturasRecibidas = req.params.IDEnvioFacturasRecibidas;
    if (!IDEnvioFacturasRecibidas) return res.status(400).send('Debe indicar el identificador de envio');
    facturasRecibidasDb.getById(IDEnvioFacturasRecibidas, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        if (registros.length == 0) return res.status(404).send("Mensaje no encontrado");
        res.json(registros[0]);
    });
})

router.get('/relacionados/:nifEmisor/:numFactura/:fechaFactura', function (req, res) {
    var nifEmisor = req.params.nifEmisor;
    var numFactura = req.params.numFactura.replaceAll('@', '/');
    var fechaFactura = req.params.fechaFactura;
    if (!numFactura || !fechaFactura) return res.status(400).send('Debe indicar un número y fecha de factura');
    facturasRecibidasDb.getRelacionadas(nifEmisor, numFactura, fechaFactura, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        res.json(registros);
    });
})

router.post('/', function (req, res) {
    var facturaRecibidas = req.body;
    if (!facturaRecibidas) return res.status(400).send('Debe incluir un objeto de envio de factura en el cuerpo del mensaje');
    facturasRecibidasDb.post(facturaRecibidas, function (err, registro) {
        if (err) return res.status(500).send(err.message);
        res.json(registro);
    });
});

router.put('/', function (req, res) {
    var facturaRecibidas = req.body;
    if (!facturaRecibidas) return res.status(400).send('Debe incluir un objeto de envío de fcatura en el cuerpo del mensaje');
    facturasRecibidasDb.put(facturaRecibidas, function (err, registro) {
        if (err) return res.status(500).send(err.message);
        res.json(registro);
    });
});

router.delete('/:IDEnvioFacturasRecibidas', function (req, res) {
    var IDEnvioFacturasRecibidas = req.params.IDEnvioFacturasRecibidas;
    if (!IDEnvioFacturasRecibidas) return res.status(400).send('Debe indicar el identificador de envio de facturas recibidas');
    facturasRecibidasDb.delete(IDEnvioFacturasRecibidas, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// -- Envios a la AEAT
router.post('/envDb/:IDEnvioFacturasRecibidas', function (req, res) {
    var IDEnvioFacturasRecibidas = req.params.IDEnvioFacturasRecibidas;
    if (!IDEnvioFacturasRecibidas) return res.status(400).send('Debe indicar el identificador de registro de facturas recibidas');
    facturasRecibidasDb.getById(IDEnvioFacturasRecibidas, function (err, registros) {
        if (err) return res.status(500).send(err.message);
        var registro = registros[0];
        var jsObject = facturasRecibidasDbToJs.recibidasDbToJs(registro);
        facturaRecibidasSoap.sendXml(jsObject, function (err, result) {
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
            facturasRecibidasDb.put(registro, function (err, data) {
                if (err) return res.status(500).send(err.message);
                if (config.Axapta == "S") {
                    var sql = "UPDATE [dbo].[CAUSIIFACTURAS] SET [CAUSIISTATUS] = 50";
                    // Son  recibidas 
                    sql += " ,[ENVIADO] = 1";
                    sql += " ,[RESULTADO] = '" + registro.Resultado + "'";
                    if (registro.CSV)
                        sql += " ,[CSV] = '" + registro.CSV + "'";
                    if (registro.Mensaje.length > 100) registro.Mensaje = registro.Mensaje.substr(0, 100);
                    sql += " ,[MENSAJE] = '" + registro.Mensaje + "'";
                    sql += " WHERE [ARIADNAID] = " + registro.IDEnvioFacturasRecibidas;
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

module.exports = router;