/*
 situacioninmueble_db_mysql.js
 Gestión del acceso a la base de datos para los situacioninmueble
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var situacioninmuebleDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM situacioninmueble";
            con.query(sql, function (err, situacioninmueble) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, situacioninmueble);
                });
            });
        });
    }
}

module.exports = situacioninmuebleDbAPI;