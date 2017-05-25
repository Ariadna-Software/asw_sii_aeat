/*
 emisores_db_mysql.js
 Gestión del acceso a la base de datos para los periodo
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var periodoDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM periodo";
            con.query(sql, function (err, periodo) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, periodo);
                });
            });
        });
    }
}

module.exports = periodoDbAPI;