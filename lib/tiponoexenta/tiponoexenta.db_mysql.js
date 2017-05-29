/*
 tiponoexenta_db_mysql.js
 Gestión del acceso a la base de datos para los tiponoexenta
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var tiponoexentaDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM tiponoexenta";
            con.query(sql, function (err, tiponoexenta) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, tiponoexenta);
                });
            });
        });
    }
}

module.exports = tiponoexentaDbAPI;