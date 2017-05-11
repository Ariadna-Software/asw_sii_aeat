/*
 tiposSoporte.js
 Funciones propias de la página TiposSoporte.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaTiposSoporteGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#tiposSoporte').attr('class', 'active');
        $('#tiposSoporte-form').submit(function () { return false; });
        apiPaginaTiposSoporteGeneral.iniTiposSoporteTabla();
        apiPaginaTiposSoporteGeneral.cargarTiposSoporte();
        $('#btnNuevo').click(apiPaginaTiposSoporteGeneral.nuevo);
    },
    iniTiposSoporteTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_tiposSoporte', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "tipoSoporteId"
        }, {
            data: "nombre"
        }, {
            data: "tipoSoporteId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaTiposSoporteGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaTiposSoporteGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_tiposSoporte').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarTiposSoporte: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-soporte", null, function (err, data) {
            if (err) return;
            apiPaginaTiposSoporteGeneral.cargarTiposSoporteTabla(data);
        });
    },
    cargarTiposSoporteTabla: function (data) {
        var dt = $('#dt_tiposSoporte').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('TiposSoporteDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('TiposSoporteDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/tipos-soporte/" + id, null, function(err){
                if (err) return;
                apiPaginaTiposSoporteGeneral.cargarTiposSoporte();
            })
        }, function(){})
    }
}


