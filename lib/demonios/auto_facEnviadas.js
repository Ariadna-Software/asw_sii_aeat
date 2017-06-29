// auto_facEmitidas.js
// Demonio que lanza cada cierto tiempo una búsqueda en la base de datos para enviar
// aquellas facturas que estén pendientes de envío
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun"),
    util = require("util"),
    async = require("async"),
    sprintf = require("sprintf-js").sprintf;

var facemitidasDb = require("../facemitidas/facemitidas.db_mysql");

var facturasEmitidasDbToJs = require("../facturasEmitidas/facturasEmitidas.dbToJs");
var facturaEmitidasSoap = require("../facturasEmitidas/facturasEmitidas.soap");

var isRunnigFacEmitidas = false;

var id = setInterval(function () {
    if (isRunnigFacEmitidas) return;
    isRunnigFacEmitidas = true;
    // el proceso se realiza protegido por transacciones
    comun.getConnectionCallback(function (err, con) {
        var ct = 0, cr = 0;
        if (err) return errConFunction(err);
        // leemos todas las facturas emitidas pendientes de enviar y con envio automático
        var sql = "SELECT * FROM envio_facturas_emitidas WHERE EnvioInmediato = 1 AND Enviada = 0";
        con.query(sql, function (err, data) {
            con.end();
            if (err) return errConFunction(err);
            if (data.length == 0) return nothingTodDo();
            ct = data.length;
            console.log("-- AUTO Facturas emitidas [START] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
            console.log("-- INICIA TRANSACCION --");
            // llamamos asícronamente a cada registro
            async.eachSeries(data, function (reg, callback) {
                enviarUna(reg, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            }, function (err) {
                if (err) return errConFunction(err, con);
                console.log("-- FINALIZA TRANSACCION--");
                console.log("-- AUTO Facturas emitidas [END] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
                isRunnigFacEmitidas = false;
            });
        });
    });
}, 5000); // lanzado cada 5 segundos

var errConFunction = function (err) {
    isRunnigFacEmitidas = false;
    console.log("ERR: ", err.message);
};

var nothingTodDo = function () {
    isRunnigFacEmitidas = false;
}

var enviarUna = function (reg, done) {
    comun.getConnectionCallback(function (err, con) {
        if (err) {
            con.end();
            return done(err);
        }
        // preparamos el mensaje para el servicio AEAT
        var jsObject = facturasEmitidasDbToJs.emitidasDbToJs(reg);
        var now, then;
        then = new Date();
        //console.log("---> Envio AEAT");
        facturaEmitidasSoap.sendXml(jsObject, function (err, result) {
            // console.log("Respuesta AEAT <---");
            now = new Date();
            var ms = moment(now).diff(moment(then));
            // var ds = moment(ms).milliseconds();
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
                var sql = "UPDATE envio_facturas_emitidas SET ? WHERE IDEnvioFacturasEmitidas = ?";
                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasEmitidas]);
                con.query(sql, function (err, data) {
                    if (err) {
                        con.end();
                        return done(err);
                    }
                    facemitidasDb.createFacEmitidaFromReg(reg, con, function (err) {
                        con.end();
                        if (err) {
                            return done(err);
                        }
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
                var sql = "UPDATE envio_facturas_emitidas SET ? WHERE IDEnvioFacturasEmitidas = ?";
                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasEmitidas]);
                con.query(sql, function (err, data) {
                    if (err) {
                        con.end();
                        return done(err);
                    }
                    facemitidasDb.createFacEmitidaFromReg(reg, con, function (err) {
                        con.end();
                        if (err) {
                            return done(err);
                        }
                        return done();
                    });
                });
            }
        });
    });
}