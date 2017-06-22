/*
 facemitidas_db_mysql.js
 Gestión del acceso a la base de datos para los facemitidas
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var facemitidasDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas";
            con.query(sql, function (err, facemitidas) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, facemitidas);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM facemitidas WHERE FacEmitidaId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, facemitidas) {
                con.end();
                if (err) return done(err);
                done(null, facemitidas);
            });
        });
    },
    post: function (facemitida, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO facemitidas SET ?";
            sql = mysql.format(sql, facemitida);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                facemitida.FacEmitidaId = registro.insertId;
                done(null, facemitida);
            });
        });
    },
    put: function (facemitida, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE facemitidas SET ? WHERE FacEmitidaId = ?";
            sql = mysql.format(sql, [facemitida, facemitida.FacEmitidaId]);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                done(null, facemitida);
            });
        });
    },
    delete: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "DELETE FROM facemitidas WHERE FacEmitidaId =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, registro) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = facemitidasDbAPI;