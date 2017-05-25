/*
 grupos-usuarios_db_mysql.js
 Gestión del acceso a la base de datos para los grupos de usuarios
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var facturaEmitidasDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM envio_facturas_emitidas";
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
            var sql = "SELECT * FROM envio_facturas_emitidas where Enviada = 0";
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
            var sql = "SELECT * FROM envio_facturas_emitidas where Enviada = 1 and Resultado <> 'Correcto'";
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
            var sql = "SELECT * FROM envio_facturas_emitidas where Enviada = 1 and Resultado = 'Correcto'";
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
    post: function (registro, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO envio_facturas_emitidas SET ?";
            sql = mysql.format(sql, registro);
            con.query(sql, function (err, reg) {
                con.end();
                if (err) return done(err);
                registro.IDEnvioFacturasEmitidas = reg.insertId;
                done(null, registro);
            });
        });
    },
    put: function (registro, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE envio_facturas_emitidas SET ? WHERE IDEnvioFacturasEmitidas = ?";
            sql = mysql.format(sql, [registro, registro.IDEnvioFacturasEmitidas]);
            con.query(sql, function (err, reg) {
                con.end();
                if (err) return done(err);
                done(null, registro);
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