/*
 facrecibidas_db_mysql.js
 Gestión del acceso a la base de datos para los facrecibidas
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var facrecibidasDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facrecibidas";
            con.query(sql, function (err, facrecibidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facrecibidas);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facrecibidas WHERE FacRecibidaId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, facrecibidas) {
                con.end();
                if (err) return done(err);
                done(null, facrecibidas);
            });
        });
    },
    post: function (emisor, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO facrecibidas SET ?";
            sql = mysql.format(sql, emisor);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                emisor.FacRecibidaId = registro.insertId;
                done(null, emisor);
            });
        });
    },
    put: function (emisor, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE facrecibidas SET ? WHERE FacRecibidaId = ?";
            sql = mysql.format(sql, [emisor, emisor.FacRecibidaId]);
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
            var sql = "DELETE FROM facrecibidas WHERE FacRecibidaId =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = facrecibidasDbAPI;