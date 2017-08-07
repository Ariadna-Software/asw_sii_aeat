/*
 grupos-usuarios_db_mysql.js
 Gestión del acceso a la base de datos para los grupos de usuarios
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var facemitidasDb = require("../facemitidas/facemitidas.db_mysql");

var sqlsDb = require("../sqls/sqls");
var config = require("../../config.json");

var facturaEmitidasDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_emitidas ORDER BY FechaHoraCreacion DESC";
            con.query(sql, function (err, grupos) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, grupos);
                });
            });
        });
    },
    getPendientes: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_emitidas where Enviada = 0 ORDER BY FechaHoraCreacion DESC";
            con.query(sql, function (err, grupos) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, grupos);
                });
            });
        });
    },
    getEnviadosIncorrectos: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_emitidas where Enviada = 1 and Resultado <> 'Correcto' ORDER BY FechaHoraCreacion DESC";
            con.query(sql, function (err, grupos) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, grupos);
                });
            });
        });
    },
    getEnviadosCorrectos: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_emitidas where Enviada = 1 and Resultado = 'Correcto' ORDER BY FechaHoraCreacion DESC";
            con.query(sql, function (err, grupos) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, grupos);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_emitidas WHERE IDEnvioFacturasEmitidas = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupos) {
                con.end();
                if (err) return done(err);
                done(null, grupos);
            });
        });
    },
    getRelacionadas: function (nifEmisor, numFactura, fechaFactura, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_emitidas WHERE REG_IDF_IDEF_NIF = ? AND REG_IDF_NumserieFacturaEmisor = ? AND REG_IDF_FechaExpedicionFacturaEmisor = ?";
            sql = mysql.format(sql, [nifEmisor, numFactura, fechaFactura]);
            con.query(sql, function (err, registros) {
                con.end();
                if (err) return done(err);
                done(null, registros);
            });
        });
    },    
    post: function (registro, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO envio_facturas_emitidas SET ?";
            sql = mysql.format(sql, registro);
            con.query(sql, function (err, reg) {
                if (err) {
                    con.end();
                    return done(err);
                }
                registro.IDEnvioFacturasEmitidas = reg.insertId;
                facemitidasDb.createFacEmitidaFromReg(registro, con, function (err) {
                    con.end();
                    if (err) return done(err);
                    done(null, registro);
                });
            });
        });
    },
    put: function (registro, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE envio_facturas_emitidas SET ? WHERE IDEnvioFacturasEmitidas = ?";
            sql = mysql.format(sql, [registro, registro.IDEnvioFacturasEmitidas]);
            con.query(sql, function (err, reg) {
                if (err) {
                    con.end();
                    return done(err);
                }
                facemitidasDb.createFacEmitidaFromReg(registro, con, function (err) {
                    con.end();
                    if (err) return done(err);
                    done(null, registro);
                });
            });
        });
    },
    delete: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "DELETE FROM envio_facturas_emitidas WHERE IDEnvioFacturasEmitidas =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = facturaEmitidasDbAPI;