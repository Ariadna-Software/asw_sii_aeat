/*
 facrecibidas_db_mysql.js
 Gestión del acceso a la base de datos para los facrecibidas
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun"),
    async = require("async"),
    sprintf = require("sprintf-js").sprintf;

var facturasRecibidasDbToJs = require("../facturasRecibidas/facturasRecibidas.dbToJs");
var facturaRecibidaSoap = require("../facturasRecibidas/facturasRecibidas.soap");

var sqlsDb = require("../sqls/sqls");
var config = require("../../config.json");

var facrecibidasDbAPI = {
    get: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facrecibidas";
            if (nifTitular) sql += " WHERE nifReceptor = '" + nifTitular + "'";
            con.query(sql, function (err, facrecibidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facrecibidas);
                });
            });
        });
    },
    getPendientes: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facrecibidas WHERE (CSV IS NULL OR Resultado = 'AceptadaConErrores')";
            if (nifTitular) sql += " AND nifReceptor = '" + nifTitular + "'";
            con.query(sql, function (err, facrecibidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facrecibidas);
                });
            });
        });
    },
    getEnviadasCorrectas: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facrecibidas WHERE (Enviada = 1 AND Resultado = 'Correcto')";
            if (nifTitular) sql += " AND nifReceptor = '" + nifTitular + "'";
            con.query(sql, function (err, facrecibidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facrecibidas);
                });
            });
        });
    },
    getEnviadasIncorrectas: function (nifTitular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facrecibidas WHERE (Enviada = 1 AND Resultado <> 'Correcto')";
            if (nifTitular) sql += " AND nifReceptor = '" + nifTitular + "'";
            con.query(sql, function (err, facrecibidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facrecibidas);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facrecibidas WHERE FacRecibidaId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, facrecibidas) {
                con.end();
                if (err) return done(err);
                done(null, facrecibidas);
            });
        });
    },
    post: function (facemitida, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO facrecibidas SET ?";
            sql = mysql.format(sql, facemitida);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                facemitida.FacRecibidaId = registro.insertId;
                done(null, facemitida);
            });
        });
    },
    put: function (facemitida, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE facrecibidas SET ? WHERE FacRecibidaId = ?";
            sql = mysql.format(sql, [facemitida, facemitida.FacRecibidaId]);
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
            // leemos el registro para tener los relacionados
            var sql = "SELECT * FROM facrecibidas WHERE FacRecibidaId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, registro) {
                if (err) {
                    con.end();
                    return done(err);
                }
                if (registro.length == 0) {
                    con.end();
                    return done(new Error("No se encuentra la factura a eliminar"));
                }
                if (registro[0].Enviada == 1) {
                    con.end();
                    return done(new Error("La factura que intenta eliminar ya ha sido enviada, no se permite el borre."));
                }
                var nifEmisor = registro[0].NifEmisor;
                var nifReceptor = registro[0].NifReceptor;
                var numFactura = registro[0].NumFactura;
                var fechaFactura = registro[0].FechaFactura;
                var ultRegistroID = registro[0].UltRegistroID;
                sql = "DELETE FROM facrecibidas WHERE FacRecibidaId = ?";
                sql = mysql.format(sql, id);
                con.query(sql, function (err, registros) {
                    if (err) {
                        conn.end();
                        return done(err);
                    }
                    sql = "DELETE FROM envio_facturas_recibidas"
                    sql += " WHERE IDEnvioFacturasRecibidas = ?";
                    sql = mysql.format(sql, ultRegistroID);
                    con.query(sql, function (err, registros) {
                        con.end();
                        if (err) return done(err);
                        if (config.Axapta == "S") {
                            var sql = "UPDATE [dbo].[CAUSIIFACTURAS] SET [CAUSIISTATUS] = 1";
                            // Son recibidas 
                            sql += " WHERE [GDESVATNUM] = '" + nifReceptor + "'";
                            sql += " AND [VATNUM] = '" + nifEmisor + "'";
                            sql += " AND [INVOICEID] = '" + numFactura + "'";
                            sqlsDb.execSQL(sql, function (err) {
                                if (err) return done(err);
                                done(null, "OK");
                            })
                        } else {
                            done(null, "OK");

                        }
                    });
                });
            });
        });
    },
    // createFacRecibidaFromReg
    // Simpre suponemos que nos pasan la conexión y de que de su cierre
    // se encarga el llamante [para cubrir con o sin transaccion]
    createFacRecibidaFromReg: function (reg, con, done) {
        // objecto dummy para fcatura
        var facRecibida = {};
        var nueva = false;
        // primero comprobamos si la factura ya existe en la base de datos
        // huston y si es extranjero?reg.REG_IDF_NumSerieFacturaEmisor
        var nifEmisor = reg.REG_IDF_IDEF_NIF;
        if (!nifEmisor) nifEmisor = reg.REG_IDF_IDEF_IDOtro_ID;
        var sql = "SELECT * FROM facrecibidas WHERE NifEmisor = ? AND NumFactura = ? AND FechaFactura = ?";
        sql = mysql.format(sql, [nifEmisor, reg.REG_IDF_NumSerieFacturaEmisor, reg.REG_IDF_FechaExpedicionFacturaEmisor]);
        con.query(sql, function (err, data) {
            facRecibida = {
                FacRecibidaId: 0,
                NifEmisor: nifEmisor,
                NombreEmisor: reg.REG_FR_CNT_NombreRazon,
                NifReceptor: reg.CAB_Titular_NIF,
                NombreReceptor: reg.CAB_Titular_NombreRazon,
                NumFactura: reg.REG_IDF_NumSerieFacturaEmisor,
                Importe: reg.REG_FR_ImporteTotal,
                FechaFactura: reg.REG_IDF_FechaExpedicionFacturaEmisor,
                FechaOperacion: reg.REG_FR_FechaOperacion,
                Enviada: reg.Enviada,
                Resultado: reg.Resultado,
                Mensaje: reg.Mensaje,
                CSV: reg.CSV,
                UltRegistroID: reg.IDEnvioFacturasRecibidas,
                Ejercicio: reg.REG_PI_Ejercicio,
                Periodo: reg.REG_PI_Periodo
            }
            if (data.length == 0) {
                // no existe hay crear registro nuevo el id ya está a cero
                nueva = true;
            } else {
                // ya existe el ID hay que ponerlo
                facRecibida.FacRecibidaId = data[0].FacRecibidaId;
            }
            if (!facRecibida.Enviada) facRecibida.Enviada = 0; // cubrimos el caso nulo
            // montamos el sql con el alta o la modificación según se trate
            if (nueva) {
                sql = "INSERT INTO facrecibidas SET ?";
                sql = mysql.format(sql, facRecibida);
            } else {
                sql = "UPDATE facrecibidas SET ? WHERE FacRecibidaId = ?";
                sql = mysql.format(sql, [facRecibida, facRecibida.FacRecibidaId]);
            }
            con.query(sql, function (err, registro) {
                if (err) return done(err);
                if (nueva) {
                    facRecibida.FacRecibidaId = registro.insertId;
                }
                done(null);
            });
        });
    },
    envioFacRecibidasPendientes: function (nifTitular, facId, done) {
        var prMessage = "";
        comun.getConnectionCallbackTransaction(function (err, con) {
            if (err) return errConFunction(err, con);
            // leemos todas las facturas recibidas pendientes de enviar y con envio automático
            var sql = "SELECT efr.* ";
            sql += " FROM envio_facturas_recibidas AS efr, facrecibidas AS fr";
            sql += " WHERE fr.Enviada = 0 AND efr.IDEnvioFacturasRecibidas = fr.UltRegistroID";
            if (nifTitular) {
                sql += " AND efr.CAB_Titular_NIF = '" + nifTitular + "'";
            }
            if (facId) {
                sql += " AND fr.FacRecibidaId = " + facId;
            }
            con.query(sql, function (err, data) {
                if (err) return facrecibidasDbAPI.errConFunction(err, con, done);
                if (data.length == 0) return nothingTodDo(con);
                console.log("-- MANUAL Facturas recibidas [START] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
                // llamamos asícronamente a cada registro
                async.each(data, function (reg, callback) {
                    // leemos el registro
                    var sql = "SELECT * FROM envio_facturas_recibidas WHERE IDEnvioFacturasRecibidas = ?";
                    sql = mysql.format(sql, reg.IDEnvioFacturasRecibidas);
                    con.query(sql, function (err, data) {
                        if (err) return callback(err);
                        // preparamos el mensaje para el servicio AEAT
                        var jsObject = facturasRecibidasDbToJs.recibidasDbToJs(reg);
                        // enviamos el mensaje
                        facturaRecibidaSoap.sendXml(jsObject, function (err, result) {
                            if (err) {
                                reg.Enviada = 1;
                                reg.Resultado = "Error";
                                reg.Mensaje = err.message;
                                var msg = sprintf("EMISOR:%s FAC:%s FECHA:%s RES:%s MSG:%s",
                                    reg.REG_IDF_IDEF_NIF,
                                    reg.REG_IDF_NumSerieFacturaEmisor,
                                    moment(reg.REG_IDF_FechaExpedicionFacturaEmisor).format("DD/MM/YYYY"),
                                    reg.Resultado,
                                    reg.Mensaje);
                                prMessage += msg + "\n";
                                var sql = "UPDATE envio_facturas_recibidas SET ? WHERE IDEnvioFacturasRecibidas = ?";
                                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasRecibidas]);
                                con.query(sql, function (err, data) {
                                    if (err) return callback(err);
                                    facrecibidasDbAPI.createFacRecibidaFromReg(reg, con, function (err) {
                                        if (err) return callback(err);
                                        if (config.Axapta == "S") {
                                            var sql = "UPDATE [dbo].[CAUSIIFACTURAS] SET [CAUSIISTATUS] = 50";
                                            // Son  recibidas 
                                            sql += " ,[ENVIADO] = 1";
                                            sql += " ,[RESULTADO] = '" + reg.Resultado + "'";
                                            if (reg.CSV)
                                                sql += " ,[CSV] = '" + reg.CSV + "'";
                                            if (reg.Mensaje.length > 100) reg.Mensaje = reg.Mensaje.substr(0, 100);
                                            sql += " ,[MENSAJE] = '" + reg.Mensaje + "'";
                                            sql += " WHERE [ARIADNAID] = " + reg.IDEnvioFacturasRecibidas;
                                            sqlsDb.execSQL(sql, function (err) {
                                                if (err) return callback(err);
                                                return callback();
                                            })
                                        } else {
                                            return callback();
                                        }
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
                                var sql = "UPDATE envio_facturas_recibidas SET ? WHERE IDEnvioFacturasRecibidas = ?";
                                sql = mysql.format(sql, [reg, reg.IDEnvioFacturasRecibidas]);
                                con.query(sql, function (err, data) {
                                    if (err) return callback(err);
                                    facrecibidasDbAPI.createFacRecibidaFromReg(reg, con, function (err) {
                                        if (err) return callback(err);
                                        if (config.Axapta == "S") {
                                            var sql = "UPDATE [dbo].[CAUSIIFACTURAS] SET [CAUSIISTATUS] = 50";
                                            // Son  recibidas 
                                            sql += " ,[ENVIADO] = 1";
                                            sql += " ,[RESULTADO] = '" + reg.Resultado + "'";
                                            if (reg.CSV)
                                                sql += " ,[CSV] = '" + reg.CSV + "'";
                                            if (reg.Mensaje.length > 100) reg.Mensaje = reg.Mensaje.substr(0, 100);
                                            sql += " ,[MENSAJE] = '" + reg.Mensaje + "'";
                                            sql += " WHERE [ARIADNAID] = " + reg.IDEnvioFacturasRecibidas;
                                            sqlsDb.execSQL(sql, function (err) {
                                                if (err) return callback(err);
                                                return callback();
                                            })
                                        } else {
                                            return callback();
                                        }
                                    });
                                });
                            }
                        });
                    });
                }, function (err) {
                    if (err) return facrecibidasDbAPI.errConFunction(err, con, done);
                    console.log(prMessage);
                    console.log("-- MANUAL Facturas recibidas [END] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
                    con.commit(function (err) {
                        con.end();
                        if (err) return facrecibidasDbAPI.errConFunction(err, con, done);
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

module.exports = facrecibidasDbAPI;