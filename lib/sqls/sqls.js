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
        new sqlServer.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(sql)
        }).then(result => {
            let rows = result.recordset
            done(null, rows);
            sqlServer.close();
        }).catch(err => {
            done(err);
            sqlServer.close();
        });
    }
}

module.exports = sqlsApi;