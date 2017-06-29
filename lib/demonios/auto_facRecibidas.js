// auto_facRecibidas.js
// Demonio que lanza cada cierto tiempo una búsqueda en la base de datos para enviar
// aquellas facturas que estén pendientes de envío
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun"),
    util = require("util"),
    async = require("async"),
    sprintf = require("sprintf-js").sprintf;

var facrecibidasDb = require("../facrecibidas/facrecibidas.db_mysql");


var facturasRecibidasDbToJs = require("../facturasRecibidas/facturasRecibidas.dbToJs");
var facturaRecibidasSoap = require("../facturasRecibidas/facturasRecibidas.soap");

var isRunnigFacRecibidas = false;

var id = setInterval(function () {
    if (isRunnigFacRecibidas) return;
    var prMessage = "";
    isRunnigFacRecibidas = true;
    // el proceso se realiza protegido por transacciones
    comun.getConnectionCallback(function (err, con) {
        if (err) return errConFunction(err, con);
        // leemos todas las facturas recibidas pendientes de enviar y con envio automático
        var sql = "SELECT * FROM envio_facturas_recibidas WHERE EnvioInmediato = 1 AND Enviada = 0";
        con.query(sql, function (err, data) {
            con.end();
            if (err) return errConFunction(err);
            if (data.length == 0) return nothingTodDo();
            console.log("-- AUTO Facturas recibidas [START] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
            console.log("-- INICIA TRANSACCION --");
            // llamamos asícronamente a cada registro
            async.eachSeries(data, function (reg, callback) {
                enviarUna(reg, function(err){
                    if (err) return callback(err);
                    callback();
                })
            }, function (err) {
                if (err) return errConFunction(err);
                console.log("-- FINALIZA TRANSACCION--");
                //console.log(prMessage);
                console.log("-- AUTO Facturas recibidas [END] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
                isRunnigFacRecibidas = false;
            });
        });
    });
}, 5000); // lanzado cada 5 segundos

var errConFunction = function (err) {
    isRunnigFacRecibidas = false;
    console.log("ERR: ", err.message);
};

var nothingTodDo = function () {
    isRunnigFacRecibidas = false;
    return;
}

var enviarUna = function (reg, done) {
    comun.getConnectionCallback(function (err, con) {
        if (err) {
            // con.end();
            done(err);
        }
        // preparamos el mensaje para el servicio AEAT
        var jsObject = facturasRecibidasDbToJs.recibidasDbToJs(reg);
        var now, then;
        then = new Date();
        // enviamos el mensaje
        facturaRecibidasSoap.sendXml(jsObject, function (err, result) {
            now = new Date();
            var ms = moment(now).diff(moment(then));
            if (err) {
                reg.Enviada = 1;
                reg.resultado = "Error";
                reg.Mensaje = err.message;
                var msg = sprintf("EMISOR:%s FAC:%s FECHA:%s RES:%s MSG:%s",
                    reg.REG_IDF_IDEF_NIF,
                    reg.REG_IDF_NumSerieFacturaEmisor,
                    moment(reg.REG_IDF_FechaExpedicionFacturaEmisor).format("DD/MM/YYYY"),
                    reg.Resultado,
                    reg.Mensaje);
                console.log(msg + " RESAEAT: " + moment(ms).format("mm:ss"));
                var sql = "UPDATE envio_facturas_recibidas SET ? WHERE IDEnvioFacturasRecibidas = ?";
                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasRecibidas]);
                con.query(sql, function (err, data) {
                    if (err) {
                        con.end();
                        done(err);
                    }
                    facrecibidasDb.createFacRecibidaFromReg(reg, con, function (err) {
                        if (err) return done(err);
                        return done();
                    });
                });
            } else {
                // Grabamos la respuesta en el mismo registro
                reg.Enviada = 1;
                reg.Resultado = result.RespuestaLinea[0].EstadoRegistro;
                reg.CSV = result.CSV;
                if (!reg.CSV)
                    reg.CSV = result.RespuestaLinea[0].CSV;
                if (result.RespuestaLinea[0].CodigoErrorRegistro) {
                    reg.Mensaje = "COD: " + result.RespuestaLinea[0].CodigoErrorRegistro + " / " + result.RespuestaLinea[0].DescripcionErrorRegistro
                } else {
                    reg.Mensaje = "";
                }
                if (result.xml)
                    reg.XML_Enviado = result.xml;
                var msg = sprintf("EMISOR:%s FAC:%s FECHA:%s RES:%s MSG:%s",
                    reg.REG_IDF_IDEF_NIF,
                    reg.REG_IDF_NumSerieFacturaEmisor,
                    moment(reg.REG_IDF_FechaExpedicionFacturaEmisor).format("DD/MM/YYYY"),
                    reg.Resultado,
                    reg.Mensaje);
                console.log(msg + " RESAEAT: " + moment(ms).format("mm:ss"));
                var sql = "UPDATE envio_facturas_recibidas SET ? WHERE IDEnvioFacturasRecibidas = ?";
                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasRecibidas]);
                con.query(sql, function (err, data) {
                    if (err) {
                        con.end();
                        done(err);
                    }
                    facrecibidasDb.createFacRecibidaFromReg(reg, con, function (err) {
                        if (err) return done(err);
                        return done();
                    });
                });
            }
        });
    });
}