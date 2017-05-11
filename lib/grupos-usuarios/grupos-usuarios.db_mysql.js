/*
 grupos-usuarios_db_mysql.js
 Gestión del acceso a la base de datos para los grupos de usuarios
*/
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var gruposUsuariosDbAPI = {
    get: function (done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM grupos_usuarios";
            con.query(sql, function (err, grupos) {
                con.end(function (err2) {
                    if (err) return done(err);
                    done(null, grupos);
                });
            });
        });
    },
    getById: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT * FROM grupos_usuarios WHERE grupoUsuarioId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupos) {
                con.end();
                if (err) return done(err);
                done(null, grupos);
            });
        });
    },
    post: function (grupoUsuarios, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "INSERT INTO grupos_usuarios SET ?";
            sql = mysql.format(sql, grupoUsuarios);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                grupoUsuarios.grupoUsuarioId = grupo.insertId;
                done(null, grupoUsuarios);
            });
        });
    },
    put: function (grupoUsuarios, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "UPDATE grupos_usuarios SET ? WHERE grupoUsuarioId = ?";
            sql = mysql.format(sql, [grupoUsuarios, grupoUsuarios.grupoUsuarioId]);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, grupoUsuarios);
            });
        });
    },
    delete: function (id, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "DELETE FROM grupos_usuarios WHERE grupoUsuarioId =  ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, grupo) {
                con.end();
                if (err) return done(err);
                done(null, 'OK');
            });
        });
    }
}

module.exports = gruposUsuariosDbAPI;