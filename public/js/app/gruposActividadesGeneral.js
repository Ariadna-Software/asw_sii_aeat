/*
 gruposActividades.js
 Funciones propias de la página GruposActividades.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaGruposActividadesGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#gruposActividades').attr('class', 'active');
        $('#gruposActividades-form').submit(function () { return false; });
        apiPaginaGruposActividadesGeneral.iniGruposActividadesTabla();
        apiPaginaGruposActividadesGeneral.cargarGruposActividades();
        $('#btnNuevo').click(apiPaginaGruposActividadesGeneral.nuevo);
    },
    iniGruposActividadesTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_gruposActividades', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "grupoActividadId"
        }, {
            data: "nombre"
        }, {
            data: "grupoActividadId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaGruposActividadesGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaGruposActividadesGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_gruposActividades').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarGruposActividades: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/grupos-actividades", null, function (err, data) {
            if (err) return;
            apiPaginaGruposActividadesGeneral.cargarGruposActividadesTabla(data);
        });
    },
    cargarGruposActividadesTabla: function (data) {
        var dt = $('#dt_gruposActividades').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('GruposActividadesDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('GruposActividadesDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/grupos-actividades/" + id, null, function(err){
                if (err) return;
                apiPaginaGruposActividadesGeneral.cargarGruposActividades();
            })
        }, function(){})
    }
}


