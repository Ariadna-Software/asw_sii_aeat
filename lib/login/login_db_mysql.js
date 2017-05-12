var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun");

var loginDbAPI = {
    login: function (login, password, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var sql = "SELECT u.*";
            sql += " FROM usuarios as u";
            sql += " WHERE login = ? AND password = ?";
            sql = mysql.format(sql, [login, password]);
            con.query(sql, function (err, data) {
                con.end();
                if (err) return done(err);
                var usuario = null;
                if (data.length != 0) usuario = data[0];
                done(null, usuario);
            });
        });
    },
    loginConClave: function (login, password, done) {
        loginDbAPI.login(login, password, function (err, usuario) {
            if (err) return done(err);
            if (!usuario) return done(null, usuario);
            comun.getConnectionCallback(function (err, con) {
                if (err) return done(err);
                usuario.getKeyTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                usuario.expKeyTime = moment(new Date()).add(5, 'h').format('YYYY-MM-DD HH:mm:ss');
                usuario.apiKey = loginDbAPI.claveAleatoria();
                var responsableId = usuario.responsableId;
                delete usuario.responsableId;
                var sql = "UPDATE usuarios SET ? WHERE usuarioId = ?";
                sql = mysql.format(sql, [usuario, usuario.usuarioId]);
                con.query(sql, function (err) {
                    con.end()
                    if (err) return done(err);
                    usuario.responsableId = responsableId;
                    done(null, usuario);
                });
            });
        });
    },
    verificarClave: function (clave, done) {
        comun.getConnectionCallback(function (err, con) {
            if (err) return done(err);
            var cTime = moment(new Date).format('YYYY-MM-DD HH:mm:ss');
            var sql = "SELECT * FROM usuarios WHERE apiKey = ? AND expKeyTime > ?";
            sql = mysql.format(sql, [clave, cTime]);
            con.query(sql, function (err, usuarios) {
                con.end();
                if (err) return done(err);
                if (usuarios.length == 0) return done(null, false);
                return done(null, true);
            });
        });
    },
    claveAleatoria: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}

module.exports = loginDbAPI;