/*
 tiposActividades.js
 Funciones propias de la página TiposActividades.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaTiposActividadesGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#tiposActividades').attr('class', 'active');
        $('#tiposActividades-form').submit(function () { return false; });
        apiPaginaTiposActividadesGeneral.iniTiposActividadesTabla();
        apiPaginaTiposActividadesGeneral.cargarTiposActividades();
        $('#btnNuevo').click(apiPaginaTiposActividadesGeneral.nuevo);
    },
    iniTiposActividadesTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_tiposActividades', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "tipoActividadId"
        }, {
            data: "nombre"
        }, {
            data: "grupo"
        }, {
            data: "tipoActividadId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaTiposActividadesGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaTiposActividadesGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_tiposActividades').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarTiposActividades: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-actividades", null, function (err, data) {
            if (err) return;
            apiPaginaTiposActividadesGeneral.cargarTiposActividadesTabla(data);
        });
    },
    cargarTiposActividadesTabla: function (data) {
        var dt = $('#dt_tiposActividades').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('TiposActividadesDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('TiposActividadesDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/tipos-actividades/" + id, null, function(err){
                if (err) return;
                apiPaginaTiposActividadesGeneral.cargarTiposActividades();
            })
        }, function(){})
    }
}


