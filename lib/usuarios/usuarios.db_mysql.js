/*
 usuarios_db_mysql.js
 Gestión del acceso a la base de datos para los grupos de usuarios
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var usuariosDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT u.*, gu.nombre as grupo FROM usuarios as u";
            sql += " LEFT JOIN grupos_usuarios as gu ON gu.grupoUsuarioId = u.grupoUsuarioId"
            con.query(sql, function (err, grupos) {
                con.end();
                if (err) return done(err);
                done(null, grupos);
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT u.*, gu.nombre as grupo FROM usuarios as u ";
            sql += " LEFT JOIN grupos_usuarios as gu ON gu.grupoUsuarioId = u.grupoUsuarioId"
            sql += " WHERE u.usuarioId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupos) {
                con.end();
                if (err) return done(err);
                done(null, grupos);
            });
        });
    },
    post: function (usuarios, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO usuarios SET ?";
            sql = mysql.format(sql, usuarios);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                usuarios.usuarioId = grupo.insertId;
                done(null, usuarios);
            });
        });
    },
    put: function (usuarios, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE usuarios SET ? WHERE usuarioId = ?";
            sql = mysql.format(sql, [usuarios, usuarios.usuarioId]);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, usuarios);
            });
        });
    },
    delete: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "DELETE FROM usuarios WHERE usuarioId =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = usuariosDbAPI;