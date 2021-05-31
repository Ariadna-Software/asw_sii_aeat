var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun"),
    util = require("util"),
    async = require("async"),
    sprintf = require("sprintf-js").sprintf;

var config = require("../../configSQLServer.json");
var fs = require('fs');

var sqlServer = require("mssql");

var sqlsApi = {
    execSQL: function (sql, done) {
        sqlServer.connect(config, function (err) {
            if (err) return done(err);
            var request = new sqlServer.Request();
            request.query(sql, function (err, recordset) {
                sqlServer.close();
                if (err) return done(err);
                return done(null, recordset);
            });
        });
    },
    execSQL2: function (sql, done) {
        //console.log("EXECSQL2");
        //console.log("Config:", config)
        const pool = new sqlServer.ConnectionPool(config);
        pool.connect(function (err) {
            if (err) return done(err);
            var request = new sqlServer.Request(pool);
            request.query(sql, function (err, recordset) {
                pool.close();
                if (err) {
                    console.log("Err:", err);
                    return done(err);
                }
                //console.log("EXECSQL2: ", recordset);
                return done(null, recordset);
            });
        });
    }
}

module.exports = sqlsApi;