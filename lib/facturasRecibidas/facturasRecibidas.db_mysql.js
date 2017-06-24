/*
 facturasRecibidas_db_mysql.js
 Gestión del acceso a la base de datos para las facturas recibidas
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var facrecibidasDb = require("../facrecibidas/facrecibidas.db_mysql");    

var facturaRecibidasDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_recibidas ORDER BY FechaHoraCreacion DESC";
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
            var sql = "SELECT * FROM envio_facturas_recibidas where Enviada = 0 ORDER BY FechaHoraCreacion DESC";
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
            var sql = "SELECT * FROM envio_facturas_recibidas where Enviada = 1 and Resultado <> 'Correcto' ORDER BY FechaHoraCreacion DESC";
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
            var sql = "SELECT * FROM envio_facturas_recibidas where Enviada = 1 and Resultado = 'Correcto' ORDER BY FechaHoraCreacion DESC";
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
            var sql = "SELECT * FROM envio_facturas_recibidas WHERE IDEnvioFacturasRecibidas = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupos) {
                con.end();
                if (err) return done(err);
                done(null, grupos);
            });
        });
    },
    post: function (registro, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO envio_facturas_recibidas SET ?";
            sql = mysql.format(sql, registro);
            con.query(sql, function (err, reg) {
                if (err) {
                    con.end();
                    return done(err);
                }
                registro.IDEnvioFacturasRecibidas = reg.insertId;
                facrecibidasDb.createFacRecibidaFromReg(registro, con, function (err) {
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
            var sql = "UPDATE envio_facturas_recibidas SET ? WHERE IDEnvioFacturasRecibidas = ?";
            sql = mysql.format(sql, [registro, registro.IDEnvioFacturasRecibidas]);
            con.query(sql, function (err, reg) {
                if (err) {
                    con.end();
                    return done(err);
                }
                facrecibidasDb.createFacRecibidaFromReg(registro, con, function (err) {
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
            var sql = "DELETE FROM envio_facturas_recibidas WHERE IDEnvioFacturasRecibidas =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = facturaRecibidasDbAPI;