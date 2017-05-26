/*
 tiporectificativa_db_mysql.js
 Gestión del acceso a la base de datos para los tiporectificativa
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var tiporectificativaDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM tiporectificativa";
            con.query(sql, function (err, tiporectificativa) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, tiporectificativa);
                });
            });
        });
    }
}

module.exports = tiporectificativaDbAPI;