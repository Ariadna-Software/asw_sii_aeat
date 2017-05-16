/*
 emisores_db_mysql.js
 Gestión del acceso a la base de datos para los emisores
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var emisoresDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM emisores";
            con.query(sql, function (err, emisores) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, emisores);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM emisores WHERE emisorId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, emisores) {
                con.end();
                if (err) return done(err);
                done(null, emisores);
            });
        });
    },
    post: function (emisor, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO emisores SET ?";
            sql = mysql.format(sql, emisor);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                emisor.emisorId = registro.insertId;
                done(null, emisor);
            });
        });
    },
    put: function (emisor, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE emisores SET ? WHERE emisorId = ?";
            sql = mysql.format(sql, [emisor, emisor.emisorId]);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                done(null, emisor);
            });
        });
    },
    delete: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "DELETE FROM emisores WHERE emisorId =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = emisoresDbAPI;