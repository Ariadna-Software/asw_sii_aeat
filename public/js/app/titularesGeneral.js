/*
 usuarios.js
 Funciones propias de la página Usuarios.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaUsuariosGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#usuarios').attr('class', 'active');
        $('#usuarios-form').submit(function () { return false; });
        apiPaginaUsuariosGeneral.iniUsuariosTabla();
        apiPaginaUsuariosGeneral.cargarUsuarios();
        $('#btnNuevo').click(apiPaginaUsuariosGeneral.nuevo);
    },
    iniUsuariosTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_usuarios', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "usuarioId"
        }, {
            data: "nombre"
        }, {
            data: "grupo"
        }, {
            data: "usuarioId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaUsuariosGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaUsuariosGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_usuarios').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarUsuarios: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/usuarios", null, function (err, data) {
            if (err) return;
            apiPaginaUsuariosGeneral.cargarUsuariosTabla(data);
        });
    },
    cargarUsuariosTabla: function (data) {
        var dt = $('#dt_usuarios').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('UsuariosDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('UsuariosDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/usuarios/" + id, null, function(err){
                if (err) return;
                apiPaginaUsuariosGeneral.cargarUsuarios();
            })
        }, function(){})
    }
}


