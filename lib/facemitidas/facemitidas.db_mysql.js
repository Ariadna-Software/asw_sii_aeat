/*
 facemitidas_db_mysql.js
 Gestión del acceso a la base de datos para los facemitidas
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var facemitidasDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getPendientes: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE Enviada = 0";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getEnviadasCorrectas: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE Enviada = 1 AND Resultado = 'Correcto'";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getEnviadasIncorrectas: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE Enviada = 1 AND Resultado <> 'Correcto'";
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
            if (data.length == 0) {
                // no existe hay crear registro nuevo
                nueva = true;
                facEmitida = {
                    FacEmitidaId: 0,
                    NifEmisor: reg.REG_IDF_IDEF_NIF,
                    NombreEmisor: reg.CAB_Titular_NombreRazon,
                    NifReceptor: reg.REG_FE_CNT_NIF,
                    NombreReceptor: reg.REG_FE_CNT_NombreRazon,
                    NumFactura: reg.REG_IDF_NumSerieFacturaEmisor,
                    FechaFactura: reg.REG_IDF_FechaExpedicionFacturaEmisor,
                    FechaOperacion: reg.REG_FE_FechaOperacion,
                    Enviada: reg.Enviada,
                    Resultado: reg.Resultado,
                    Mensaje: reg.Mensaje,
                    CSV: reg.CSV,
                    UltRegistroID: reg.IDEnvioFacturasEmitidas
                }
            } else {
                // ya existe
                facEmitida = data[0];
                facEmitida.NombreEmisor = reg.CAB_Titular_NombreRazon;
                facEmitida.FechaOperacion = reg.REG_FE_FechaOperacion;
                facEmitida.Enviada = reg.Enviada;
                facEmitida.Resultado = reg.Resultado;
                facEmitida.Mensaje = reg.Mensaje;
                facEmitida.CSV = reg.CSV;
                facEmitida.UltRegistroID = reg.IDEnvioFacturasEmitidas;
            }
            if (!facEmitida.Enviada) facEmitida.Enviada = 0; // cibrimos el caso nulo
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
                // montar relaciones
                facemitidasDbAPI.createRelFacEmitida(facEmitida, con, function (err) {
                    if (err) return done(err);
                    done(null);
                })
            });
        });
    },
    // createRelFacEmitida
    // monta las relaciones entre la factura y sus registros
    createRelFacEmitida: function (facEmitida, con, done) {
        var sql = "SELECT * FROM relfacemit WHERE FacEmitidaId = ? AND IDEnvioFacturasEmitidas = ?";
        sql = mysql.format(sql, [facEmitida.FacEmitidaId, facEmitida.IDEnvioFacturasEmitidas]);
        con.query(sql, function (err, data) {
            if (err) return done(err);
            if (data.length != 0) {
                // si ya existe no hacemos nada
                return done(null);
            } else {
                var RelFacEmit = {
                    RelFacEmitId: 0,
                    FacEmitidaId: facEmitida.FacEmitidaId,
                    IDEnvioFacturasEmitidas: facEmitida.IDEnvioFacturasEmitidas
                }
                sql = "INSERT INTO relfacemit SET ?";
                sql = mysql.format(sql, RelFacEmit);
                con.query(sql, function (err) {
                    if (err) return done(err);
                    done(null);
                });
            }
        })
    }
}

module.exports = facemitidasDbAPI;