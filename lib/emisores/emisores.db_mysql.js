/*
 titulares_db_mysql.js
 Gestión del acceso a la base de datos para los titulares
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var titularesDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM titulares";
            con.query(sql, function (err, titulares) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, titulares);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM titulares WHERE titularId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, titulares) {
                con.end();
                if (err) return done(err);
                done(null, titulares);
            });
        });
    },
    post: function (titular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO titulares SET ?";
            sql = mysql.format(sql, titular);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                titular.titularId = grupo.insertId;
                done(null, titular);
            });
        });
    },
    put: function (titular, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE titulares SET ? WHERE titularId = ?";
            sql = mysql.format(sql, [titular, titular.titularId]);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, titular);
            });
        });
    },
    delete: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "DELETE FROM titulares WHERE titularId =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = titularesDbAPI;