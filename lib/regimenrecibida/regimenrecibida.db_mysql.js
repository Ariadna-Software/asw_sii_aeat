/*
 regimenrecibida_db_mysql.js
 Gestión del acceso a la base de datos para los regimenrecibida
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var regimenrecibidaDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM regimenrecibida";
            con.query(sql, function (err, regimenrecibida) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, regimenrecibida);
                });
            });
        });
    }
}

module.exports = regimenrecibidaDbAPI;