/*
 emisores_db_mysql.js
 Gestión del acceso a la base de datos para los tipoComunicacion
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var tipoComunicacionDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM tipo_comunicacion";
            con.query(sql, function (err, tipoComunicacion) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, tipoComunicacion);
                });
            });
        });
    }
}

module.exports = tipoComunicacionDbAPI;