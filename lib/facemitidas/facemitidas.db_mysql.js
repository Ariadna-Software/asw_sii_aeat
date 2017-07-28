/*
 facemitidas_db_mysql.js
 Gestión del acceso a la base de datos para los facemitidas
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun"),
    async = require("async"),
    sprintf = require("sprintf-js").sprintf;

var facturasEmitidasDbToJs = require("../facturasEmitidas/facturasEmitidas.dbToJs");
var facturaEmitidasSoap = require("../facturasEmitidas/facturasEmitidas.soap");

var facemitidasDbAPI = {
    get: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas";
            if (nifTitular) sql += " WHERE nifEmisor = '" + nifTitular + "'";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getPendientes: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE (CSV IS NULL OR Resultado = 'AceptadaConErrores')";
            if (nifTitular) sql += " AND nifEmisor = '" + nifTitular + "'";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getEnviadasCorrectas: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE (Enviada = 1 AND Resultado = 'Correcto')";
            if (nifTitular) sql += " AND nifEmisor = '" + nifTitular + "'";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getEnviadasIncorrectas: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE (Enviada = 1 AND Resultado <> 'Correcto')";
            if (nifTitular) sql += " AND nifEmisor = '" + nifTitular + "'";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE FacEmitidaId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, facemitidas) {
                con.end();
                if (err) return done(err);
                done(null, facemitidas);
            });
        });
    },
    post: function (facemitida, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO facemitidas SET ?";
            sql = mysql.format(sql, facemitida);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                facemitida.FacEmitidaId = registro.insertId;
                done(null, facemitida);
            });
        });
    },
    put: function (facemitida, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE facemitidas SET ? WHERE FacEmitidaId = ?";
            sql = mysql.format(sql, [facemitida, facemitida.FacEmitidaId]);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                done(null, facemitida);
            });
        });
    },
    delete: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "DELETE FROM facemitidas WHERE FacEmitidaId =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    },
    // createFacEmitidaFromReg
    // Simpre suponemos que nos pasan la conexión y de que de su cierre
    // se encarga el llamante [para cubrir con o sin transaccion]
    createFacEmitidaFromReg: function (reg, con, done) {
        // objecto dummy para fcatura
        var facEmitida = {};
        var nueva = false;
        // primero comprobamos si la factura ya existe en la base de datos
        var sql = "SELECT * FROM facemitidas WHERE NifEmisor = ? AND NumFactura = ? AND FechaFactura = ?";
        sql = mysql.format(sql, [reg.REG_IDF_IDEF_NIF, reg.REG_IDF_NumSerieFacturaEmisor, reg.REG_IDF_FechaExpedicionFacturaEmisor]);
        con.query(sql, function (err, data) {
            facEmitida = {
                FacEmitidaId: 0,
                NifEmisor: reg.REG_IDF_IDEF_NIF,
                NombreEmisor: reg.CAB_Titular_NombreRazon,
                NifReceptor: reg.REG_FE_CNT_NIF,
                NombreReceptor: reg.REG_FE_CNT_NombreRazon,
                NumFactura: reg.REG_IDF_NumSerieFacturaEmisor,
                Importe: reg.REG_FE_ImporteTotal,
                FechaFactura: reg.REG_IDF_FechaExpedicionFacturaEmisor,
                FechaOperacion: reg.REG_FE_FechaOperacion,
                Enviada: reg.Enviada,
                Resultado: reg.Resultado,
                Mensaje: reg.Mensaje,
                CSV: reg.CSV,
                UltRegistroID: reg.IDEnvioFacturasEmitidas
            }
            if (data.length == 0) {
                // no existe hay crear registro nuevo el id ya está a cero
                nueva = true;
            } else {
                // ya existe el ID hay que ponerlo
                facEmitida.FacEmitidaId = data[0].FacEmitidaId;
            }
            if (!facEmitida.Enviada) facEmitida.Enviada = 0; // cubrimos el caso nulo
            // montamos el sql con el alta o la modificación según se trate
            if (nueva) {
                sql = "INSERT INTO facemitidas SET ?";
                sql = mysql.format(sql, facEmitida);
            } else {
                sql = "UPDATE facemitidas SET ? WHERE FacEmitidaId = ?";
                sql = mysql.format(sql, [facEmitida, facEmitida.FacEmitidaId]);
            }
            con.query(sql, function (err, registro) {
                if (err) return done(err);
                if (nueva) {
                    facEmitida.FacEmitidaId = registro.insertId;
                }
                done(null);
            });
        });
    },
    envioFacEmitidasPendientes: function (nifTitular, done) {
        var prMessage = "";
        comun.getConnectionCallbackTransaction(function (err, con) {
            if (err) return errConFunction(err, con);
            // leemos todas las facturas emitidas pendientes de enviar y con envio automático
            var sql = "SELECT efe.* ";
            sql += " FROM envio_facturas_emitidas AS efe, facemitidas AS fe";
            sql += " WHERE fe.Enviada = 0 AND efe.IDEnvioFacturasEmitidas = fe.UltRegistroID";
            if (nifTitular){
                sql += " AND efe.CAB_Titular_NIF = '" + nifTitular + "'";
            }
            con.query(sql, function (err, data) {
                if (err) return facemitidasDbAPI.errConFunction(err, con, done);
                if (data.length == 0) return nothingTodDo(con);
                console.log("-- MANUAL Facturas emitidas [START] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
                // llamamos asícronamente a cada registro
                async.each(data, function (reg, callback) {
                    // leemos el registro
                    var sql = "SELECT * FROM envio_facturas_emitidas WHERE IDEnvioFacturasEmitidas = ?";
                    sql = mysql.format(sql, reg.IDEnvioFacturasEmitidas);
                    con.query(sql, function (err, data) {
                        if (err) return callback(err);
                        // preparamos el mensaje para el servicio AEAT
                        var jsObject = facturasEmitidasDbToJs.emitidasDbToJs(reg);
                        // enviamos el mensaje
                        facturaEmitidasSoap.sendXml(jsObject, function (err, result) {
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
                                prMessage += msg + "\n";
                                var sql = "UPDATE envio_facturas_emitidas SET ? WHERE IDEnvioFacturasEmitidas = ?";
                                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasEmitidas]);
                                con.query(sql, function (err, data) {
                                    if (err) return callback(err);
                                    facemitidasDbAPI.createFacEmitidaFromReg(reg, con, function (err) {
                                        if (err) return callback(err);
                                        return callback();
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
                                prMessage += msg + "\n";
                                var sql = "UPDATE envio_facturas_emitidas SET ? WHERE IDEnvioFacturasEmitidas = ?";
                                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasEmitidas]);
                                con.query(sql, function (err, data) {
                                    if (err) return callback(err);
                                    facemitidasDbAPI.createFacEmitidaFromReg(reg, con, function (err) {
                                        if (err) return callback(err);
                                        return callback();
                                    });
                                });
                            }
                        });
                    });
                }, function (err) {
                    if (err) return facemitidasDbAPI.errConFunction(err, con, done);
                    console.log(prMessage);
                    console.log("-- MANUAL Facturas emitidas [END] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
                    isRunnigFacEmitidas = false;
                    con.commit(function (err) {
                        con.end();
                        if (err) return facemitidasDbAPI.errConFunction(err, con, done);
                        done(null, prMessage);
                    });
                });
            });
        });
    },
    errConFunction: function (err, con, done) {
        console.log("ERR: ", err.message);
        con.rollback(function () { });
        con.end();
        return done(err);
    }

}

module.exports = facemitidasDbAPI;