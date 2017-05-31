/*
 tiporecibida_db_mysql.js
 Gestión del acceso a la base de datos para los tiporecibida
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var tiporecibidaDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM tiporecibida";
            con.query(sql, function (err, tiporecibida) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, tiporecibida);
                });
            });
        });
    }
}

module.exports = tiporecibidaDbAPI;