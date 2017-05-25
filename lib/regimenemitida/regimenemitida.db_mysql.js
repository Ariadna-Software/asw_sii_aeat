/*
 regimenemitida_db_mysql.js
 Gestión del acceso a la base de datos para los regimenemitida
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var regimenemitidaDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM regimenemitida";
            con.query(sql, function (err, regimenemitida) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, regimenemitida);
                });
            });
        });
    }
}

module.exports = regimenemitidaDbAPI;