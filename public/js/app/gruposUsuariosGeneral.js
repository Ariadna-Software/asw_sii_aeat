/*
 gruposUsuarios.js
 Funciones propias de la página GruposUsuarios.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaGruposUsuariosGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#gruposUsuarios').attr('class', 'active');
        $('#gruposUsuarios-form').submit(function () { return false; });
        apiPaginaGruposUsuariosGeneral.iniGruposUsuariosTabla();
        apiPaginaGruposUsuariosGeneral.cargarGruposUsuarios();
        $('#btnNuevo').click(apiPaginaGruposUsuariosGeneral.nuevo);
    },
    iniGruposUsuariosTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_gruposUsuarios', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "grupoUsuarioId"
        }, {
            data: "nombre"
        }, {
            data: "grupoUsuarioId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaGruposUsuariosGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaGruposUsuariosGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_gruposUsuarios').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarGruposUsuarios: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/grupos-usuarios", null, function (err, data) {
            if (err) return;
            apiPaginaGruposUsuariosGeneral.cargarGruposUsuariosTabla(data);
        });
    },
    cargarGruposUsuariosTabla: function (data) {
        var dt = $('#dt_gruposUsuarios').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('GruposUsuariosDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('GruposUsuariosDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/grupos-usuarios/" + id, null, function(err){
                if (err) return;
                apiPaginaGruposUsuariosGeneral.cargarGruposUsuarios();
            })
        }, function(){})
    }
}


