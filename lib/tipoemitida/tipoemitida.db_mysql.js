/*
 emisores_db_mysql.js
 Gestión del acceso a la base de datos para los tipoemitida
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var tipoemitidaDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM tipoemitida";
            con.query(sql, function (err, tipoemitida) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, tipoemitida);
                });
            });
        });
    }
}

module.exports = tipoemitidaDbAPI;