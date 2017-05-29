/*
 causaexencion_db_mysql.js
 Gestión del acceso a la base de datos para los causaexencion
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var causaexencionDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM causaexencion";
            con.query(sql, function (err, causaexencion) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, causaexencion);
                });
            });
        });
    }
}

module.exports = causaexencionDbAPI;